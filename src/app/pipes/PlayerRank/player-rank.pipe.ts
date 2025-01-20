import {Pipe, PipeTransform} from '@angular/core';
import { BasePlayer } from '../../models/BasePlayer';

@Pipe({
  name: 'playerRank'
})
export class PlayerRankPipe implements PipeTransform {

	transform(player: BasePlayer, players: BasePlayer[]): number {
		if (!players || players.length === 0) {
			return 0;
		}

		const sortedPlayers: BasePlayer[] = [...players].sort((a, b) => b.points - a.points);

		return sortedPlayers.findIndex(p => p.id === player.id) + 1;
	}

}
