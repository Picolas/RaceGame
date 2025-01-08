import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Player } from '../../models/Player';
import { Game } from '../../models/Game';
import { NgClass } from '@angular/common';
import { PlayerLeftPercentagePipe } from '../../pipes/PlayerLeftPercentage/player-left-percentage.pipe';
import { ConfettiService } from '../../core/services/ConfettiService/confetti.service';
import { GameStatus } from '../../models/GameStatus';

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
	players = input<Player[]>([]);
	game = input<Game | null>();
	private confettiService = inject(ConfettiService);
	previousPoints: { [key: string]: number } = {};
	isFirstRender = true;

	constructor() {
		effect(() => {
			const currentGame = this.game();
			if (currentGame?.status === GameStatus.FINISHED) {
				this.confettiService.fireworks();
			}
		});
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
				}, 250);
			}
			this.previousPoints[player.id] = player.points;
		});
	}
}
