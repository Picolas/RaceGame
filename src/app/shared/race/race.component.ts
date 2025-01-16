import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { ConfettiService } from '../../core/services/ConfettiService/confetti.service';
import { GameStatus } from '../../models/GameStatus';
import { signal } from '@angular/core';
import { RaceTrackComponent } from '../race-track/race-track.component';
import { BasePlayer } from '../../models/BasePlayer';
import { Game } from '../../models/BaseGame';

@Component({
	selector: 'app-race',
	standalone: true,
	imports: [
		RaceTrackComponent,
	],
	templateUrl: './race.component.html',
	styleUrl: './race.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceComponent {
	private confettiService = inject(ConfettiService);
	private hasLaunchedFireworks = signal(false);
	private sortedPlayers = signal<BasePlayer[]>([]);
	private isAnimating = signal(false);
	private playerMovements = signal<{ [key: string]: { type: 'up' | 'down' | null, timestamp: number } }>({});
	private movementTimeouts: { [key: string]: any } = {};
	players = input<BasePlayer[]>([]);
	allPlayers = input<BasePlayer[]>([]);
	game = input<Game | null>(null);
	previousPoints: { [key: string]: number } = {};
	isFirstRender = true;


	constructor() {
		effect(() => {
			this.sortedPlayers.set([...this.players()].sort((a, b) => b.points - a.points));
		});

		effect(() => {
			const currentGame = this.game();
			if (currentGame?.status === GameStatus.FINISHED && !this.hasLaunchedFireworks()) {
				this.confettiService.clearFireworks();
				this.confettiService.fireworks();
				this.hasLaunchedFireworks.set(true);
			} else if (currentGame?.status !== GameStatus.FINISHED) {
				this.hasLaunchedFireworks.set(false);
			}
		});
	}

	ngOnDestroy() {
		Object.values(this.movementTimeouts).forEach(timeout => {
			clearTimeout(timeout);
		});
		this.confettiService.clearFireworks();
	}

	ngOnChanges() {
		if (this.isFirstRender) {
			this.isFirstRender = false;
			this.players().forEach(player => {
				this.previousPoints[player.id] = player.points;
			});
			return;
		}

		const previousOrder = this.sortedPlayers();
		const newOrder = [...this.players()].sort((a, b) => b.points - a.points);

		// Détecter les mouvements
		previousOrder.forEach((player, index) => {
			const newIndex = newOrder.findIndex(p => p.id === player.id);
			if (newIndex < index) {
				// Nettoyer le timeout existant si présent
				if (this.movementTimeouts[player.id]) {
					clearTimeout(this.movementTimeouts[player.id]);
				}

				this.playerMovements.update(state => ({
					...state,
					[player.id]: { type: 'up', timestamp: Date.now() }
				}));

				this.movementTimeouts[player.id] = setTimeout(() => {
					this.playerMovements.update(state => ({
						...state,
						[player.id]: { type: null, timestamp: 0 }
					}));
					delete this.movementTimeouts[player.id];
				}, 2000);
			} else if (newIndex > index) {
				if (this.movementTimeouts[player.id]) {
					clearTimeout(this.movementTimeouts[player.id]);
				}

				this.playerMovements.update(state => ({
					...state,
					[player.id]: { type: 'down', timestamp: Date.now() }
				}));

				this.movementTimeouts[player.id] = setTimeout(() => {
					this.playerMovements.update(state => ({
						...state,
						[player.id]: { type: null, timestamp: 0 }
					}));
					delete this.movementTimeouts[player.id];
				}, 2000);
			}
		});

		let animationCount = 0;
		this.isAnimating.set(true);

		this.players().forEach(player => {
			const previousPoints = this.previousPoints[player.id] || 0;
			if (player.points > previousPoints) {
				animationCount++;
				setTimeout(() => {
					const horseElement = document.querySelector(`#horse-${player.id}`);
					if (horseElement) {
						const rect = horseElement.getBoundingClientRect();
						const x = rect.left + rect.width / 2;
						const y = rect.top + rect.height / 2;
						this.confettiService.launchAt(x, y);
					}
				}, 400);
			}
			this.previousPoints[player.id] = player.points;
		});

		if (animationCount > 0) {
			setTimeout(() => {
				this.isAnimating.set(false);
				this.sortedPlayers.set([...this.players()].sort((a, b) => b.points - a.points));
			}, 1000);
		}
	}

	getDisplayOrder(playerId: string): number {
		return this.sortedPlayers().findIndex(p => p.id === playerId);
	}

	getPlayerMovementClass(playerId: string): string {
		const movement = this.playerMovements()[playerId];
		if (!movement || !movement.type) return '';

		// Vérifier si 2 secondes se sont écoulées depuis le début de l'animation
		if (Date.now() - movement.timestamp >= 2000) {
			// Au lieu de mettre à jour le signal ici, on programme une mise à jour
			setTimeout(() => {
				this.playerMovements.update(state => ({
					...state,
					[playerId]: { type: null, timestamp: 0 }
				}));
			}, 0);
			return '';
		}

		return `movement-${movement.type}`;
	}
}
