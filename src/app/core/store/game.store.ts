import {gameReducer} from './reducers/game.reducer';
import {provideStore} from '@ngrx/store';

export const gameStore = provideStore({
	game: gameReducer
}, {
	runtimeChecks: {
		strictStateImmutability: true,
		strictActionImmutability: true,
	}
});
