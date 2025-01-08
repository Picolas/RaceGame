import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../models/Player';
import { MAX_RACE_PERCENTAGE, RACE_PERCENTAGE_WIN } from '../../core/config/config';
import { Game } from '../../models/Game';
import { GameStatus } from '../../models/GameStatus';

@Pipe({
	name: 'playerLeftPercentage'
})
export class PlayerLeftPercentagePipe implements PipeTransform {

	transform(points: number, players: Player[], game?: Game | null): number {
		const maxPoints = players.length ? Math.max(...players.map(player => player.points)) : 100;

		if (maxPoints === 0) {
			return 0;
		}

		const maxPercentage = game?.status === GameStatus.FINISHED ? RACE_PERCENTAGE_WIN : MAX_RACE_PERCENTAGE;

		const minPercentagePerPoint = 3;
		const smoothPercentage = Math.pow(points / maxPoints, 0.8) * 100;
		const adjustedPercentage = Math.max(smoothPercentage, points * minPercentagePerPoint);
		return Math.min(adjustedPercentage, maxPercentage);
	}

}
