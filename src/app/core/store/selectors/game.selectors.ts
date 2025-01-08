import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from '../reducers/game.reducer';
import {Game} from '../../../models/Game';
import {Player} from '../../../models/Player';

export const selectGameState = createFeatureSelector<GameState>('game');

export const selectCurrentGame = createSelector(
	selectGameState,
	(state: GameState): Game | null => state.currentGame ? {...state.currentGame} : null
);

export const selectPlayers = createSelector(
	selectCurrentGame,
	(game: Game | null): Player[] => {
		if (!game?.players) return [];
		return [...game.players].map(player => ({...player}));
	}
);

export const selectLoading = createSelector(
	selectGameState,
	(state: GameState) => state.loading
);

export const selectError = createSelector(
	selectGameState,
	(state: GameState) => state.error
);

