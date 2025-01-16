import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../LocalStorageService/local-storage.service';
import { Game } from '../../../models/BaseGame';
import { Observable, of } from 'rxjs';
import { GameStatus } from '../../../models/GameStatus';
import { GameType } from '../../../models/GameType';
import { TeamPlayer } from '../../../models/TeamPlayer';
import { Role } from '../../../models/Role';
import { Team } from '../../../models/Team';
import { PhotoService } from '../PhotoService/photo.service';
import { BasePlayer } from '../../../models/BasePlayer';

@Injectable({
	providedIn: 'root'
})
export class GameService {
	private storageKey = 'currentGame';
	private localStorageService: LocalStorageService = inject(LocalStorageService);
	private photoService: PhotoService = inject(PhotoService);
	private defaultPhotoUrl = '/assets/img/profile_picture.png';

	getCurrentGame(): Observable<Game | null> {
		const game = this.localStorageService.getItem<Game>(this.storageKey);
		return of(game);
	}

	createOrResetGame(game: Partial<Game>): Observable<Game> {
		const baseGame = {
			id: game.id || this.generateId(),
			name: game.name || 'Challenge eXalt',
			status: game.status || GameStatus.CREATED,
			createdAt: game.createdAt || new Date(),
			gameType: game.gameType || GameType.SOLO_PLAYERS,
		};

		let newGame: Game;

		if (baseGame.gameType === GameType.SOLO_PLAYERS) {
			newGame = {
				...baseGame,
				gameType: GameType.SOLO_PLAYERS,
				players: (game.players || []).map(player => ({
					...player,
					id: player.id || this.generateId(),
					points: player.points || 0,
					horse: this.getRandomHorse(),
					photo: this.getPhotoUrl(player)
				})),
				teams: null
			};
		} else {
			newGame = {
				...baseGame,
				gameType: GameType.TEAMS,
				teams: (game.teams || []).map(team => ({
					...team,
					id: team.id || this.generateId(),
					points: team.players?.reduce((sum, p) => sum + (p.points || 0), 0) || 0,
					players: (team.players || []).map(player => ({
						...player,
						id: player.id || this.generateId(),
						points: player.points || 0,
						horse: this.getRandomHorse(),
						photo: this.getPhotoUrl(player),
						role: Role.PLAYER,
					}))
				})),
				players: null
			};
			newGame.teams.forEach(team => {
				team.players.forEach(player => player.teamId = team.id);
			});
		}

		this.localStorageService.setItem(this.storageKey, newGame);
		return of(newGame);
	}

	updateGame(updatedGame: Partial<Game>): Observable<Game | null> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) return of(null);

		const newGame: Game = currentGame.gameType === GameType.SOLO_PLAYERS ? {
			...currentGame,
			...updatedGame,
			gameType: GameType.SOLO_PLAYERS,
			players: currentGame.players || [],
			teams: null
		} : {
			...currentGame,
			...updatedGame,
			gameType: GameType.TEAMS,
			teams: currentGame.teams || [],
			players: null
		};

		this.localStorageService.setItem(this.storageKey, newGame);
		return of(newGame);
	}

	addPlayer(player: BasePlayer, teamId?: string): Observable<Game> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		const basePlayer = {
			...player,
			id: this.generateId(),
			points: 0,
			horse: this.getRandomHorse(),
			photo: this.getPhotoUrl(player)
		};

		let updatedGame: Game;

		if (currentGame.gameType === GameType.SOLO_PLAYERS) {
			updatedGame = {
				...currentGame,
				players: [...currentGame.players, basePlayer]
			};
		} else if (teamId) {
			const teamPlayer: TeamPlayer = {
				...basePlayer,
				role: Role.PLAYER,
				teamId
			};

			const updatedTeams = currentGame.teams.map(team => {
				if (team.id === teamId) {
					const updatedPlayers = [...team.players, teamPlayer];
					return {
						...team,
						players: updatedPlayers,
						points: updatedPlayers.reduce((sum, p) => sum + p.points, 0)
					};
				}
				return team;
			});

			updatedGame = {
				...currentGame,
				teams: updatedTeams
			};
		} else {
			throw new Error('ID d\'équipe requis pour le mode équipe');
		}

		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(updatedGame);
	}

	updatePlayerPoints(player: BasePlayer | TeamPlayer, points: number): Observable<BasePlayer | TeamPlayer> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}
		if (points < 0) {
			throw new Error('Les points ne peuvent pas être négatifs');
		}

		if (currentGame.gameType === GameType.SOLO_PLAYERS) {
			const updatedPlayers = currentGame.players.map(p => {
				if (p.id === player.id) {
					return { ...p, points };
				}
				return p;
			});

			const updatedGame: Game = {
				...currentGame,
				players: updatedPlayers
			};
			this.localStorageService.setItem(this.storageKey, updatedGame);
			return of({ ...player, points });
		} else {
			const updatedTeams = currentGame.teams.map(team => {
				if (team.id === (player as TeamPlayer).teamId) {
					const updatedPlayers = team.players.map(p => {
						if (p.id === player.id) {
							return { ...p, points };
						}
						return p;
					});
					return {
						...team,
						players: updatedPlayers,
						points: updatedPlayers.reduce((sum, p) => sum + p.points, 0)
					};
				}
				return team;
			});

			const updatedGame: Game = {
				...currentGame,
				teams: updatedTeams
			};
			this.localStorageService.setItem(this.storageKey, updatedGame);
			return of({ ...player, points });
		}
	}

	removePlayer(player: BasePlayer | TeamPlayer): Observable<void> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		if (currentGame.gameType === GameType.SOLO_PLAYERS) {
			const updatedGame: Game = {
				...currentGame,
				players: currentGame.players.filter(p => p.id !== player.id)
			};
			this.localStorageService.setItem(this.storageKey, updatedGame);
		} else {
			const updatedTeams = currentGame.teams.map(team => {
				if (team.id === (player as TeamPlayer).teamId) {
					const updatedPlayers = team.players.filter(p => p.id !== player.id);
					return {
						...team,
						players: updatedPlayers,
						points: updatedPlayers.reduce((sum, p) => sum + p.points, 0)
					};
				}
				return team;
			});

			const updatedGame: Game = {
				...currentGame,
				teams: updatedTeams
			};
			this.localStorageService.setItem(this.storageKey, updatedGame);
		}

		return of(void 0);
	}

	resetPoints(): Observable<Game> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		let updatedGame: Game;

		if (currentGame.gameType === GameType.SOLO_PLAYERS) {
			updatedGame = {
				...currentGame,
				players: currentGame.players.map(player => ({
					...player,
					points: 0
				}))
			};
		} else {
			updatedGame = {
				...currentGame,
				teams: currentGame.teams.map(team => ({
					...team,
					points: 0,
					players: team.players.map(player => ({
						...player,
						points: 0
					}))
				}))
			};
		}

		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(updatedGame);
	}

	startGame(): Observable<Game> {
		return this.updateGame({ status: GameStatus.STARTED }) as Observable<Game>;
	}

	endGame(): Observable<Game> {
		return this.updateGame({ status: GameStatus.FINISHED }) as Observable<Game>;
	}

	restartGame(): Observable<Game> {
		return this.updateGame({ status: GameStatus.STARTED }) as Observable<Game>;
	}

	deleteAndCreateNewGame(): Observable<void> {
		this.localStorageService.removeItem(this.storageKey);
		return of(void 0);
	}

	private generateId(): string {
		return Math.random().toString(36).substr(2, 9);
	}

	private getRandomHorse(): string {
		const min = 1;
		const max = 12;
		return `horse${Math.floor(Math.random() * (max - min + 1) + min)}`;
	}

	private getPhotoUrl(player: BasePlayer): string {
		return player.photo ? this.photoService.getPhotoUrlFromInput(player.photo) || this.defaultPhotoUrl : this.defaultPhotoUrl;
	}

	removeTeam(team: Team): Observable<void> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		if (currentGame.gameType === GameType.SOLO_PLAYERS) {
			throw new Error('Impossible de supprimer une équipe en mode solo');
		}

		if (currentGame.teams.length <= 1) {
			throw new Error('Impossible de supprimer la dernière équipe');
		}

		const updatedGame: Game = {
			...currentGame,
			teams: currentGame.teams.filter(t => t.id !== team.id)
		};

		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(void 0);
	}

	addTeam(team: Partial<Team>): Observable<Game> {
		const currentGame = this.localStorageService.getItem<Game>(this.storageKey);
		if (!currentGame) {
			throw new Error('Aucune partie en cours');
		}

		if (currentGame.gameType !== GameType.TEAMS) {
			throw new Error('Impossible d\'ajouter une équipe en mode joueurs solo');
		}

		if (!team.name || !team.color || !team.coach) {
			throw new Error('Informations d\'équipe incomplètes');
		}

		const newTeam: Team = {
			id: this.generateId(),
			name: team.name,
			color: team.color,
			points: 0,
			players: [],
			coach: {
				...team.coach,
				id: this.generateId(),
				teamId: ''
			}
		};

		newTeam.coach.teamId = newTeam.id;

		const updatedGame: Game = {
			...currentGame,
			teams: [...currentGame.teams, newTeam]
		};

		this.localStorageService.setItem(this.storageKey, updatedGame);
		return of(updatedGame);
	}
}
