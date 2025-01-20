import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed, inject, effect } from '@angular/core';
import { GameService } from '../services/GameService/game.service';
import { LocalStorageService } from '../services/LocalStorageService/local-storage.service';
import { Router } from '@angular/router';
import { Game } from '../../models/BaseGame';
import { GameType } from '../../models/GameType';
import { TeamPlayer } from '../../models/TeamPlayer';
import { Team } from '../../models/Team';
import { BasePlayer } from '../../models/BasePlayer';

export interface GameState {
	currentGame: Game | null;
	loading: boolean;
	error: any;
}

const initialState: GameState = {
	currentGame: null,
	loading: false,
	error: null
};

export const GameStore = signalStore(
	{ providedIn: 'root' },
	withState<GameState>(initialState),

	withComputed((state) => ({
		players: computed(() => {
			const game = state.currentGame();
			if (!game) return [];
			if (game.gameType === GameType.SOLO_PLAYERS) {
				return game.players;
			}
			// Pour les jeux en équipe, on retourne tous les joueurs de toutes les équipes
			return game.teams.flatMap(team => team.players);
		}),
		teams: computed(() => {
			const game = state.currentGame();
			return game?.gameType === GameType.TEAMS ? game.teams : [];
		}),
		game: computed(() => state.currentGame())
	})),

	withMethods((store, gameService = inject(GameService), localStorageService = inject(LocalStorageService), router = inject(Router)) => {
		effect(() => {
			localStorageService.storageChange$.subscribe(({ key, value }) => {
				if (key === 'currentGame') {
					patchState(store, {
						currentGame: value,
						loading: false,
						error: null
					});
				}
			});
		});

		return {
			loadGame() {
				patchState(store, { loading: true });
				gameService.getCurrentGame().subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false,
							error: null
						});
					},
					error: (error) => patchState(store, { error, loading: false })
				});
			},

			createOrResetGame(game: Partial<Game>) {
				patchState(store, { loading: true });
				gameService.createOrResetGame(game).subscribe({
					next: (createdGame) => {
						patchState(store, {
							currentGame: createdGame,
							loading: false
						});
					},
					error: (error) => patchState(store, { error, loading: false })
				});
			},

			updatePlayerPoints(player: BasePlayer | TeamPlayer, points: number) {
				patchState(store, { loading: true });
				gameService.updatePlayerPoints(player, points).subscribe({
					next: (updatedPlayer) => {
						const currentGame = store.currentGame();
						if (!currentGame) return;

						if (currentGame.gameType === GameType.SOLO_PLAYERS) {
							const updatedPlayers = currentGame.players.map(p =>
								p.id === updatedPlayer.id ? updatedPlayer as BasePlayer : p
							);
							patchState(store, {
								currentGame: { ...currentGame, players: updatedPlayers },
								loading: false
							});
						} else {
							const updatedTeams = currentGame.teams.map(team => {
								if (team.id === (updatedPlayer as TeamPlayer).teamId) {
									const updatedPlayers = team.players.map(p =>
										p.id === updatedPlayer.id ? updatedPlayer as TeamPlayer : p
									);
									const teamPoints = updatedPlayers.reduce((sum, p) => sum + p.points, 0);
									return { ...team, players: updatedPlayers, points: teamPoints };
								}
								return team;
							}) as Team[];
							patchState(store, {
								currentGame: { ...currentGame, teams: updatedTeams },
								loading: false
							});
						}
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			addPlayer(player: BasePlayer, teamId?: string) {
				patchState(store, { loading: true });
				gameService.addPlayer(player, teamId).subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false
						});
					},
					error: (error) => patchState(store, { error, loading: false })
				});
			},

			removePlayer(player: BasePlayer | TeamPlayer) {
				patchState(store, { loading: true });
				gameService.removePlayer(player).subscribe({
					next: () => {
						const currentGame = store.currentGame();
						if (!currentGame) return;

						if (currentGame.gameType === GameType.SOLO_PLAYERS) {
							const updatedPlayers = currentGame.players.filter(p => p.id !== player.id);
							patchState(store, {
								currentGame: { ...currentGame, players: updatedPlayers },
								loading: false
							});
						} else {
							const updatedTeams = currentGame.teams.map(team => {
								if (team.id === (player as TeamPlayer).teamId) {
									const updatedPlayers = team.players.filter(p => p.id !== player.id);
									const teamPoints = updatedPlayers.reduce((sum, p) => sum + p.points, 0);
									return { ...team, players: updatedPlayers, points: teamPoints };
								}
								return team;
							});
							patchState(store, {
								currentGame: { ...currentGame, teams: updatedTeams },
								loading: false
							});
						}
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			startGame() {
				patchState(store, { loading: true });
				gameService.startGame().subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false
						});
					},
					error: (error) => patchState(store, { error, loading: false })
				});
			},

			endGame() {
				patchState(store, { loading: true });
				gameService.endGame().subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false
						});
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			resetPoints() {
				patchState(store, { loading: true });
				gameService.resetPoints().subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false
						});
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			restartGame() {
				patchState(store, { loading: true });
				gameService.restartGame().subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false
						});
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			deleteAndCreateNewGame() {
				patchState(store, { loading: true });
				gameService.deleteAndCreateNewGame().subscribe({
					next: () => {
						patchState(store, {
							currentGame: null,
							loading: false
						});
						router.navigate(['/create-game']);
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			addTeam(team: Partial<Team>) {
				patchState(store, { loading: true });

				gameService.addTeam(team).subscribe({
					next: (game) => {
						patchState(store, {
							currentGame: game,
							loading: false
						});
					},
					error: (error) => patchState(store, {
						error: error.message,
						loading: false
					})
				});
			},

			removeTeam(team: Team) {
				patchState(store, { loading: true });

				gameService.removeTeam(team).subscribe({
					next: () => {
						const currentGame = store.currentGame();
						if (!currentGame) return;

						if (currentGame.gameType === GameType.SOLO_PLAYERS) return;

						patchState(store, {
							currentGame: {
								...currentGame,
								teams: currentGame.teams.filter(t => t.id !== team.id)
							},
							loading: false
						});
					},
					error: (error) => patchState(store, {
						error: error.message,
						loading: false
					})
				});
			}
		};
	})
);
