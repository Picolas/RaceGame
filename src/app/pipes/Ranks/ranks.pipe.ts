import { Pipe, PipeTransform } from '@angular/core';
import {Player} from '../../models/Player';

@Pipe({
  name: 'ranks'
})
export class RanksPipe implements PipeTransform {

  transform(players: Player[] | null): Player[] {
	  	if (!players || players.length === 0) {
	  return [];
	}

	return [...players].sort((a, b) => b.points - a.points);
  }

}
