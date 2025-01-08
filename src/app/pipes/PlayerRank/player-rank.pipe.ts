import {Pipe, PipeTransform} from '@angular/core';
import {Player} from '../../models/Player';

@Pipe({
  name: 'playerRank'
})
export class PlayerRankPipe implements PipeTransform {

	transform(player: Player, players: Player[]): number {
		if (!players || players.length === 0) {
			return 0;
		}

		const sortedPlayers: Player[] = [...players].sort((a, b) => b.points - a.points);

		return sortedPlayers.findIndex(p => p.id === player.id) + 1;
	}

}
