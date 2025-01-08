import { createReducer, on } from '@ngrx/store';
import * as GameActions from '../actions/game.actions';
import { Game } from '../../../models/Game';
import {Player} from '../../../models/Player';

export interface GameState {
	currentGame: Game | null;
	loading: boolean;
	error: any;
}

export const initialState: GameState = {
	currentGame: null,
	loading: false,
	error: null,
};

export const gameReducer = createReducer(
	initialState,

	// Charger la partie
	on(GameActions.loadGame, (state) => ({ ...state, loading: true })),
	on(GameActions.loadGameSuccess, (state, { game }) => ({
		...state,
		currentGame: game,
		loading: false,
	})),
	on(GameActions.loadGameFailure, (state, { error }) => ({
		...state,
		loading: false,
		error,
	})),

	// Créer ou réinitialiser la partie
	on(GameActions.createOrResetGame, (state) => ({ ...state, loading: true })),
	on(GameActions.createOrResetGameSuccess, (state, { game }) => ({
		...state,
		currentGame: game,
		loading: false,
	})),
	on(GameActions.createOrResetGameFailure, (state, { error }) => ({
		...state,
		loading: false,
		error,
	})),

	// Mettre à jour la partie
	on(GameActions.updateGame, (state) => ({ ...state, loading: true })),
	on(GameActions.updateGameSuccess, (state, { game }) => ({
		...state,
		currentGame: game,
		loading: false,
	})),
	on(GameActions.updateGameFailure, (state, { error }) => ({
		...state,
		loading: false,
		error,
	})),

	// Supprimer la partie
	on(GameActions.deleteGame, (state) => ({ ...state, loading: true })),
	on(GameActions.deleteGameSuccess, (state) => ({
		...state,
		currentGame: null,
		loading: false,
	})),
	on(GameActions.deleteGameFailure, (state, { error }) => ({
		...state,
		loading: false,
		error,
	})),

	// Ajouter un joueur
	on(GameActions.addPlayer, (state) => ({ ...state, loading: true })),
	on(GameActions.addPlayerSuccess, (state, { player }) => {
		if (state.currentGame) {
			const updatedGame: Game = {
				...state.currentGame,
				players: [...state.currentGame.players, player],
			};
			return { ...state, currentGame: updatedGame, loading: false };
		}
		return state;
	}),
	on(GameActions.addPlayerFailure, (state, { error }) => ({
		...state,
		loading: false,
		error,
	})),

	// Player Points
	on(GameActions.updatePlayerPoints, (state) => ({...state, loading: true})),
	on(GameActions.updatePlayerPointsSuccess, (state, { player, points }) => {
		console.log('Reducer: Player Points Updated', { player, points });
		if (state.currentGame) {
			const updatedPlayers = state.currentGame.players.map(p =>
				p.id === player.id ? { ...p, points } : p
			);
			const updatedGame: Game = {
				...state.currentGame,
				players: updatedPlayers,
			};
			return { ...state, currentGame: updatedGame, loading: false };
		}
		return state;
	}),
	on(GameActions.updatePlayerPointsFailure, (state, { error }) => ({
		...state,
		loading: false,
		error
	})),
);
