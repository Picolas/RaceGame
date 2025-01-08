import { Pipe, PipeTransform } from '@angular/core';
import {Player} from '../../models/Player';
import { MAX_RACE_PERCENTAGE } from '../../core/config/config';

@Pipe({
  name: 'playerLeftPercentage'
})
export class PlayerLeftPercentagePipe implements PipeTransform {

	transform(points: number, players: Player[]): number {
		const maxPoints = players.length ? Math.max(...players.map(player => player.points)) : 100;
		const minPercentagePerPoint = 5;
		const percentage = (points / maxPoints) * 100;
		const adjustedPercentage = Math.max(percentage, points * minPercentagePerPoint);
		return Math.min(adjustedPercentage, MAX_RACE_PERCENTAGE);
	}

}
