import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed, inject, effect } from '@angular/core';
import { GameService } from '../services/GameService/game.service';
import { Game } from '../../models/Game';
import { Player } from '../../models/Player';
import { LocalStorageService } from '../services/LocalStorageService/local-storage.service';
import { Router } from '@angular/router';

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
		players: computed(() => state.currentGame()?.players || []),
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

			updatePlayerPoints(player: Player, points: number) {
				patchState(store, { loading: true });
				gameService.updatePlayerPoints(player, points).subscribe({
					next: (updatedPlayer) => {
						const currentGame = store.currentGame();
						if (currentGame) {
							const updatedPlayers = currentGame.players.map(p =>
								p.id === updatedPlayer.id ? updatedPlayer : p
							);
							patchState(store, {
								currentGame: { ...currentGame, players: updatedPlayers },
								loading: false
							});
						}
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
				});
			},

			addPlayer(player: Player) {
				patchState(store, { loading: true });
				gameService.addPlayer(player).subscribe({
					next: () => {
						const currentGame = store.currentGame();
						if (currentGame) {
							patchState(store, {
								loading: false,
								currentGame: {
									...currentGame,
									players: [...currentGame.players]
								}
							}
							);
						}
					},
					error: (error) => patchState(store, { error, loading: false })
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

			removePlayer(player: Player) {
				patchState(store, { loading: true });
				gameService.removePlayer(player).subscribe({
					next: () => {
						const currentGame = store.currentGame();
						if (currentGame) {
							const updatedPlayers = currentGame.players.filter(p => p.id !== player.id);
							patchState(store, {
								currentGame: { ...currentGame, players: updatedPlayers },
								loading: false
							});
						}
					},
					error: (error) => patchState(store, { error: error.message, loading: false })
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
			}
		};
	})
);
