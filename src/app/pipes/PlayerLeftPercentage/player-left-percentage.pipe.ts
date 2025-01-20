import { Pipe, PipeTransform } from '@angular/core';
import { BasePlayer } from '../../models/BasePlayer';
import { Game } from '../../models/BaseGame';
import { computeLeftPercentage } from '../../utils/percentage.utils';

@Pipe({
	name: 'playerLeftPercentage'
})
export class PlayerLeftPercentagePipe implements PipeTransform {

	transform(points: number, players: BasePlayer[], game?: Game | null): number {
		const maxPoints = players.length ? Math.max(...players.map(player => player.points)) : 100;
		return computeLeftPercentage(points, maxPoints, game);
	}
}
