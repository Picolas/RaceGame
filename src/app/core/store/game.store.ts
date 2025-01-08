import { computed, inject, Injectable, signal } from '@angular/core';
import { Game } from '../../models/Game';
import { Player } from '../../models/Player';
import { GameService } from '../../features/game/services/GameService/game.service';

export interface GameState {
	currentGame: Game | null;
	loading: boolean;
	error: any;
}

@Injectable({ providedIn: 'root' })
export class GameStore {
	private gameService = inject(GameService);

	// State
	private state = signal<GameState>({
		currentGame: null,
		loading: false,
		error: null
	});

	// Selectors
	readonly currentGame = computed(() => this.state().currentGame);
	readonly loading = computed(() => this.state().loading);
	readonly error = computed(() => this.state().error);
	readonly players = computed(() => {
		return this.state().currentGame?.players || [];
	});

	// Actions
	loadGame() {
		this.state.update(state => ({ ...state, loading: true }));
		this.gameService.getCurrentGame().subscribe({
			next: (game) => {
				if (game) {
					this.state.set({
						currentGame: game,
						loading: false,
						error: null
					});
				}
			},
			error: (error) => {
				this.state.update(state => ({
					...state,
					error,
					loading: false
				}));
			}
		});
	}

	createOrResetGame(game: Partial<Game>) {
		this.state.update(state => ({ ...state, loading: true }));
		this.gameService.createOrResetGame(game).subscribe({
			next: (createdGame) => {
				this.state.update(state => ({
					...state,
					currentGame: createdGame,
					loading: false
				}));
			},
			error: (error) => {
				this.state.update(state => ({
					...state,
					error,
					loading: false
				}));
			}
		});
	}

	addPlayer(player: Player) {
		this.state.update(state => ({ ...state, loading: true }));
		this.gameService.addPlayer(player).subscribe({
			next: (addedPlayer) => {
				this.state.update(state => {
					if (!state.currentGame) return state;
					return {
						...state,
						currentGame: {
							...state.currentGame,
							players: [...state.currentGame.players, addedPlayer]
						},
						loading: false
					};
				});
			},
			error: (error) => {
				this.state.update(state => ({
					...state,
					error,
					loading: false
				}));
			}
		});
	}

	updatePlayerPoints(player: Player, points: number) {
		this.state.update(state => ({ ...state, loading: true }));
		this.gameService.updatePlayerPoints(player, points).subscribe({
			next: (updatedPlayer) => {
				this.state.update(state => {
					if (!state.currentGame) return state;

					const updatedPlayers = state.currentGame.players.map(p =>
						p.id === player.id ? { ...p, points } : p
					);

					return {
						...state,
						currentGame: {
							...state.currentGame,
							players: updatedPlayers
						},
						loading: false
					};
				});
			},
			error: (error) => {
				this.state.update(state => ({
					...state,
					error,
					loading: false
				}));
			}
		});
	}

	startGame() {
		this.state.update(state => ({ ...state, loading: true }));
		this.gameService.startGame().subscribe({
			next: (game) => {
				this.state.update(state => ({
					...state,
					currentGame: game,
					loading: false
				}));
			},
			error: (error) => {
				this.state.update(state => ({
					...state,
					error,
					loading: false
				}));
			}
		});
	}
}
