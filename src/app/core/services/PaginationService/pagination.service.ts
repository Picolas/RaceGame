import { Injectable, signal, inject } from '@angular/core';
import { PLAYERS_FIRST_PAGE, PLAYERS_PER_PAGE } from '../../config/config';
import { LocalStorageService } from '../LocalStorageService/local-storage.service';
import { BasePlayer } from '../../../models/BasePlayer';

@Injectable({
	providedIn: 'root'
})
export class PaginationService {
	private localStorageService = inject(LocalStorageService);

	private firstPageSize = signal(this.getStoredFirstPageSize());
	private otherPagesSize = signal(this.getStoredOtherPagesSize());

	private getStoredFirstPageSize(): number {
		const stored = this.localStorageService.getItem<number>('firstPageSize');
		return stored || PLAYERS_FIRST_PAGE;
	}

	private getStoredOtherPagesSize(): number {
		const stored = this.localStorageService.getItem<number>('otherPagesSize');
		return stored || PLAYERS_PER_PAGE;
	}

	getFirstPageSize(): number {
		return this.firstPageSize();
	}

	getOtherPagesSize(): number {
		return this.otherPagesSize();
	}

	updatePageSizes(firstPage: number, otherPages: number) {
		this.firstPageSize.set(firstPage);
		this.otherPagesSize.set(otherPages);

		this.localStorageService.setItem('firstPageSize', firstPage);
		this.localStorageService.setItem('otherPagesSize', otherPages);
	}

	getPagedPlayers(players: BasePlayer[], page: number = 1): BasePlayer[] {
		const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

		if (page === 1) {
			return sortedPlayers.slice(0, this.firstPageSize());
		}

		const start = this.firstPageSize() + (page - 2) * this.otherPagesSize();
		const end = start + this.otherPagesSize();
		return sortedPlayers.slice(start, end);
	}

	getTotalPages(players: BasePlayer[]): number {
		if (players.length <= this.firstPageSize()) {
			return 1;
		}

		const remainingPlayers = players.length - this.firstPageSize();
		return 1 + Math.ceil(remainingPlayers / this.otherPagesSize());
	}
}
