import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../models/Player';
import { MAX_RACE_PERCENTAGE } from '../../core/config/config';

@Pipe({
	name: 'playerLeftPercentage'
})
export class PlayerLeftPercentagePipe implements PipeTransform {

	transform(points: number, players: Player[]): number {
		const maxPoints = players.length ? Math.max(...players.map(player => player.points)) : 100;

		if (maxPoints === 0) {
			return 0;
		}

		const minPercentagePerPoint = 3;
		const smoothPercentage = Math.pow(points / maxPoints, 0.8) * 100;
		const adjustedPercentage = Math.max(smoothPercentage, points * minPercentagePerPoint);
		return Math.min(adjustedPercentage, MAX_RACE_PERCENTAGE);
	}

}
