import { Pipe, PipeTransform } from '@angular/core';
import { BasePlayer } from '../../models/BasePlayer';

@Pipe({
  name: 'ranks'
})
export class RanksPipe implements PipeTransform {

  transform(players: BasePlayer[] | null): BasePlayer[] {
	  	if (!players || players.length === 0) {
	  return [];
	}

	return [...players].sort((a, b) => b.points - a.points);
  }

}
