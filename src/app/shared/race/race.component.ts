import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Player } from '../../models/Player';
import { Game } from '../../models/Game';
import { NgClass } from '@angular/common';
import { PlayerLeftPercentagePipe } from '../../pipes/PlayerLeftPercentage/player-left-percentage.pipe';
import { ConfettiService } from '../../core/services/ConfettiService/confetti.service';
import { GameStatus } from '../../models/GameStatus';
import { signal } from '@angular/core';

@Component({
	selector: 'app-race',
	standalone: true,
	imports: [
		NgClass,
		PlayerLeftPercentagePipe
	],
	templateUrl: './race.component.html',
	styleUrl: './race.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceComponent {
	private confettiService = inject(ConfettiService);
	players = input<Player[]>([]);
	game = input<Game | null>();
	previousPoints: { [key: string]: number } = {};
	isFirstRender = true;
	private hasLaunchedFireworks = signal(false);

	constructor() {
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

		this.players().forEach(player => {
			const previousPoints = this.previousPoints[player.id] || 0;
			if (player.points > previousPoints) {
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
	}
}
