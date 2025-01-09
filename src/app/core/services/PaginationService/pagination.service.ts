import { Injectable } from '@angular/core';
import { Player } from '../../../models/Player';
import { PLAYERS_FIRST_PAGE, PLAYERS_PER_PAGE } from '../../config/config';

@Injectable({
	providedIn: 'root'
})
export class PaginationService {
	private readonly FIRST_PAGE_SIZE = PLAYERS_FIRST_PAGE;
	private readonly OTHER_PAGES_SIZE = PLAYERS_PER_PAGE;

	getPagedPlayers(players: Player[], page: number = 1): Player[] {
		if (page === 1) {
			return players.slice(0, this.FIRST_PAGE_SIZE);
		}

		const start = this.FIRST_PAGE_SIZE + (page - 2) * this.OTHER_PAGES_SIZE;
		const end = start + this.OTHER_PAGES_SIZE;
		return players.slice(start, end);
	}

	getTotalPages(players: Player[]): number {
		if (players.length <= this.FIRST_PAGE_SIZE) {
			return 1;
		}

		const remainingPlayers = players.length - this.FIRST_PAGE_SIZE;
		return 1 + Math.ceil(remainingPlayers / this.OTHER_PAGES_SIZE);
	}
}
