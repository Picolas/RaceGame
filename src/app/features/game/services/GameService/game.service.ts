import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../../../core/services/LocalStorageService/local-storage.service';
import { Game } from '../../../../models/Game';
import { Observable, of } from 'rxjs';
import { GameStatus } from '../../../../models/GameStatus';
import { Player } from '../../../../models/Player';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	private storageKey = 'currentGame';
	private localStorageService: LocalStorageService = inject(LocalStorageService);

	getCurrentGame(): Observable<Game | null> {
		const game = this.localStorageService.getItem<Game>(this.storageKey);
		return of(game);
	}

	createOrResetGame(game: Partial<Game>): Observable<Game> {
		const newGame: Game = {
			id: game.id || this.generateId(),
			name: game.name || 'Challenge eXalt',
			players: (game.players || []).map(player => ({
				...player,
				id: player.id || this.generateId(),
				points: player.points || 0,
				horse: this.getRandomHorse()
			})),
			status: game.status || GameStatus.CREATED,
			createdAt: game.createdAt || new Date()
		};

		this.localStorageService.setItem(this.storageKey, newGame);
		return of(newGame);
	}

	updateGame(updatedGame: Partial<Game>): Observable<Game | null> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			return of(null);
		}

		const newGame = { ...currentGame, ...updatedGame };
		this.localStorageService.setItem(this.storageKey, newGame);
		return of(newGame);
	}

	deleteGame(): Observable<void> {
		this.localStorageService.removeItem(this.storageKey);
		return of();
	}

	addPlayer(player: Player): Observable<Player> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		player.id = this.generateId();
		player.horse = this.getRandomHorse();

		const updatedGame: Game = {
			...currentGame,
			players: [...currentGame.players, player]
		}
		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(player);
	}

	updatePlayerPoints(player: Player, points: number): Observable<Player> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}
		if (points < 0) {
			throw new Error('Les points ne peuvent pas être négatifs');
		}

		const updatedPlayers = currentGame.players.map(p => {
			if (p.id === player.id) {
				return { ...p, points: points };
			}
			return p;
		});

		const updatedGame: Game = {
			...currentGame,
			players: updatedPlayers
		}
		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of({ ...player, points });
	}

	startGame(): Observable<Game | null> {
		return this.updateGame({ status: GameStatus.STARTED });
	}

	private generateId(): string {
		return Math.random().toString(36).substr(2, 9);
	}

	private getRandomHorse(): string {
		const min = 1;
		const max = 8;

		return `horse${Math.floor(Math.random() * (max - min + 1) + min)}`;
	}

	removePlayer(player: Player): Observable<void> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		const updatedGame: Game = {
			...currentGame,
			players: currentGame.players.filter(p => p.id !== player.id)
		}
		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(void 0);
	}

	endGame(): Observable<void> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		const updatedGame: Game = {
			...currentGame,
			status: GameStatus.FINISHED
		}
		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(void 0);
	}

	resetPoints(): Observable<Game | null> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		const updatedGame: Game = {
			...currentGame,
			players: currentGame.players.map(player => ({
				...player,
				points: 0
			}))
		};
		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(updatedGame);
	}

	restartGame(): Observable<Game | null> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		const updatedGame: Game = {
			...currentGame,
			status: GameStatus.STARTED
		};
		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(updatedGame);
	}

	deleteAndCreateNewGame(): Observable<void> {
		this.localStorageService.removeItem(this.storageKey);
		return of(void 0);
	}
}
