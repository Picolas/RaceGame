import {inject, Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as GameSelectors from '../../core/store/selectors/game.selectors';

@Injectable({
	providedIn: 'root'
})
export class GameExistsGuard implements CanActivate {
	private router: Router = inject(Router);
	private store: Store = inject(Store);

	canActivate(): Observable<boolean> {
		return this.store.pipe(
			select(GameSelectors.selectCurrentGame),
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
