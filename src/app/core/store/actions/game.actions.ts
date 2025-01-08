import { createAction, props } from '@ngrx/store';
import {Game} from '../../../models/Game';
import {Player} from '../../../models/Player';

// Charger une partie
export const loadGame = createAction('[Game] Load Game');
export const loadGameSuccess = createAction(
	'[Game] Load Game Success',
	props<{ game: Game | null }>()
);
export const loadGameFailure = createAction(
	'[Game] Load Game Failure',
	props<{ error: any }>()
);

// Créer ou réinitialiser une partie
export const createOrResetGame = createAction(
	'[Game] Create or Reset Game',
	props<{ game: Partial<Game> }>()
);
export const createOrResetGameSuccess = createAction(
	'[Game] Create or Reset Game Success',
	props<{ game: Game }>()
);
export const createOrResetGameFailure = createAction(
	'[Game] Create or Reset Game Failure',
	props<{ error: any }>()
);

// Mettre à jour une partie
export const updateGame = createAction(
	'[Game] Update Game',
	props<{ game: Partial<Game> }>()
);
export const updateGameSuccess = createAction(
	'[Game] Update Game Success',
	props<{ game: Game | null }>()
);
export const updateGameFailure = createAction(
	'[Game] Update Game Failure',
	props<{ error: any }>()
);

// Supprimer une partie
export const deleteGame = createAction('[Game] Delete Game');
export const deleteGameSuccess = createAction('[Game] Delete Game Success');
export const deleteGameFailure = createAction(
	'[Game] Delete Game Failure',
	props<{ error: any }>()
);

// Ajouter un joueur
export const addPlayer = createAction(
	'[Game] Add Player',
	props<{ player: Player }>()
);
export const addPlayerSuccess = createAction(
	'[Game] Add Player Success',
	props<{ player: Player }>()
);
export const addPlayerFailure = createAction(
	'[Game] Add Player Failure',
	props<{ error: any }>()
);

// Points
export const updatePlayerPoints = createAction(
	'[Game] Update Player Points',
	props<{ player: Player, points: number }>()
);
export const updatePlayerPointsSuccess = createAction(
	'[Game] Update Player Points Success',
	props<{ player: Player, points: number }>()
);
export const updatePlayerPointsFailure = createAction(
	'[Game] Update Player Points Failure',
	props<{ error: any }>()
);

