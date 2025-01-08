import { inject, Injectable, Injector } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { GameStore } from '../../core/store/game.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root'
})
export class GameExistsGuard implements CanActivate {
	private router = inject(Router);
	private gameStore = inject(GameStore);
	private injector = inject(Injector);

	canActivate() {
		return toObservable(this.gameStore.currentGame, { injector: this.injector }).pipe(
			take(1),
			map(game => {
				if (game) {
					return true;
				} else {
					this.router.navigate(['/create-game']);
					return false;
				}
			})
		);
	}
}
