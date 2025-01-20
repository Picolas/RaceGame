import { Component, effect, inject, input, signal } from '@angular/core';
import { ConfettiService } from '../../core/services/ConfettiService/confetti.service';
import { Game } from '../../models/BaseGame';
import { GameStatus } from '../../models/GameStatus';
import { Team } from '../../models/Team';
import { RaceTrackComponent } from './race-track/race-track.component';

@Component({
  selector: 'app-race-team',
	imports: [
		RaceTrackComponent,

	],
  templateUrl: './race-team.component.html',
  styleUrl: './race-team.component.scss'
})
export class RaceTeamComponent {
	private confettiService = inject(ConfettiService);
	private hasLaunchedFireworks = signal(false);
	private sortedTeams = signal<Team[]>([]);
	private isAnimating = signal(false);
	private teamMovements = signal<{ [key: string]: { type: 'up' | 'down' | null, timestamp: number } }>({});
	private movementTimeouts: { [key: string]: any } = {};
	teams = input<Team[]>([]);
	allTeams = input<Team[]>([]);
	game = input<Game | null>(null);
	previousPoints: { [key: string]: number } = {};
	isFirstRender = true;


	constructor() {
		effect(() => {
			this.sortedTeams.set([...this.teams()].sort((a, b) => b.points - a.points));
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
			this.teams().forEach(team => {
				this.previousPoints[team.id] = team.points;
			});
			return;
		}

		const previousOrder = this.sortedTeams();
		const newOrder = [...this.teams()].sort((a, b) => b.points - a.points);

		// Détecter les mouvements
		previousOrder.forEach((team, index) => {
			const newIndex = newOrder.findIndex(t => t.id === team.id);
			if (newIndex < index) {
				// Nettoyer le timeout existant si présent
				if (this.movementTimeouts[team.id]) {
					clearTimeout(this.movementTimeouts[team.id]);
				}

				this.teamMovements.update(state => ({
					...state,
					[team.id]: { type: 'up', timestamp: Date.now() }
				}));

				this.movementTimeouts[team.id] = setTimeout(() => {
					this.teamMovements.update(state => ({
						...state,
						[team.id]: { type: null, timestamp: 0 }
					}));
					delete this.movementTimeouts[team.id];
				}, 2000);
			} else if (newIndex > index) {
				if (this.movementTimeouts[team.id]) {
					clearTimeout(this.movementTimeouts[team.id]);
				}

				this.teamMovements.update(state => ({
					...state,
					[team.id]: { type: 'down', timestamp: Date.now() }
				}));

				this.movementTimeouts[team.id] = setTimeout(() => {
					this.teamMovements.update(state => ({
						...state,
						[team.id]: { type: null, timestamp: 0 }
					}));
					delete this.movementTimeouts[team.id];
				}, 2000);
			}
		});

		let animationCount = 0;
		this.isAnimating.set(true);

		this.teams().forEach(team => {
			const previousPoints = this.previousPoints[team.id] || 0;
			if (team.points > previousPoints) {
				animationCount++;
				setTimeout(() => {
					const horseElement = document.querySelector(`#horse-${team.id}`);
					if (horseElement) {
						const rect = horseElement.getBoundingClientRect();
						const x = rect.left + rect.width / 2;
						const y = rect.top + rect.height / 2;
						this.confettiService.launchAt(x, y);
					}
				}, 400);
			}
			this.previousPoints[team.id] = team.points;
		});

		if (animationCount > 0) {
			setTimeout(() => {
				this.isAnimating.set(false);
				this.sortedTeams.set([...this.teams()].sort((a, b) => b.points - a.points));
			}, 1000);
		}
	}

	getDisplayOrder(teamId: string): number {
		return this.sortedTeams().findIndex(t => t.id === teamId);
	}

	getTeamMovementClass(teamId: string): string {
		const movement = this.teamMovements()[teamId];
		if (!movement || !movement.type) return '';

		// Vérifier si 2 secondes se sont écoulées depuis le début de l'animation
		if (Date.now() - movement.timestamp >= 2000) {
			// Au lieu de mettre à jour le signal ici, on programme une mise à jour
			setTimeout(() => {
				this.teamMovements.update(state => ({
					...state,
					[teamId]: { type: null, timestamp: 0 }
				}));
			}, 0);
			return '';
		}

		return `movement-${movement.type}`;
	}
}
