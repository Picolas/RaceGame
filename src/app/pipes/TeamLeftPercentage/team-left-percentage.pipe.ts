import { Pipe, PipeTransform } from '@angular/core';
import { Game } from '../../models/BaseGame';
import { Team } from '../../models/Team';
import { computeLeftPercentage } from '../../utils/percentage.utils';

@Pipe({
	name: 'teamLeftPercentage'
})
export class TeamLeftPercentagePipe implements PipeTransform {

	transform(points: number, teams: Team[], game?: Game | null): number {
		const maxPoints = teams.length ? Math.max(...teams.map(team => team.points)) : 100;
		return computeLeftPercentage(points, maxPoints, game);
	}
}
