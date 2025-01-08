import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GameActions from '../actions/game.actions';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {GameService} from '../../../features/game/services/GameService/game.service';
import {Game} from '../../../models/Game';
import {Player} from '../../../models/Player';

@Injectable()
export class GameEffects {
	private actions$: Actions = inject(Actions);
	private gameService: GameService = inject(GameService);

	loadGame$ = createEffect(() => {
		return this.actions$.pipe(
			ofType(GameActions.loadGame),
			mergeMap(() => {
				console.log('Effect: loadGame triggered');
				return this.gameService.getCurrentGame().pipe(
					map((game: Game | null) => {
						console.log('Effect: loadGameSuccess', game);
						return GameActions.loadGameSuccess({ game });
					}),
					catchError((error) => {
						console.error('Effect: loadGameFailure', error);
						return of(GameActions.loadGameFailure({ error }));
					})
				);
			})
		)
	});

	// Effect pour créer ou réinitialiser la partie
	createOrResetGame$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GameActions.createOrResetGame),
			mergeMap((action) => {
				console.log('Effect: createOrResetGame triggered', action.game);
				return this.gameService.createOrResetGame(action.game).pipe(
					map((game: Game) => {
						console.log('Effect: createOrResetGameSuccess', game);
						return GameActions.createOrResetGameSuccess({ game });
					}),
					catchError((error) => {
						console.error('Effect: createOrResetGameFailure', error);
						return of(GameActions.createOrResetGameFailure({ error }));
					})
				);
			})
		)
	);

	// Effect pour mettre à jour la partie
	updateGame$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GameActions.updateGame),
			mergeMap((action) =>
				this.gameService.updateGame(action.game).pipe(
					map((game: Game | null) => GameActions.updateGameSuccess({ game })),
					catchError((error) => of(GameActions.updateGameFailure({ error })))
				)
			)
		)
	);

	// Effect pour supprimer la partie
	deleteGame$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GameActions.deleteGame),
			mergeMap(() =>
				this.gameService.deleteGame().pipe(
					map(() => GameActions.deleteGameSuccess()),
					catchError((error) => of(GameActions.deleteGameFailure({ error })))
				)
			)
		)
	);

	// Effect pour ajouter un joueur
	addPlayer$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GameActions.addPlayer),
			mergeMap((action) =>
				this.gameService.addPlayer(action.player).pipe(
					map((player: Player) => GameActions.addPlayerSuccess({ player })),
					catchError((error) => of(GameActions.addPlayerFailure({ error })))
				)
			)
		)
	);

	// Effect pour mettre à jour les points d'un joueur
	updatePlayerPoints$ = createEffect(() =>
		this.actions$.pipe(
			ofType(GameActions.updatePlayerPoints),
			switchMap((action) =>
				this.gameService.updatePlayerPoints(action.player, action.points).pipe(
					map((player: Player) => {
						console.log('Effect: Player Points Updated', player);
						return GameActions.updatePlayerPointsSuccess({ player, points: action.points });
					}),
					catchError((error) => of(GameActions.updatePlayerPointsFailure({ error })))
				)
			)
		)
	);

}
