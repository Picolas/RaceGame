import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Game} from '../../../../models/Game';
import {Player} from '../../../../models/Player';
import {map} from 'rxjs/operators';
import * as GameSelectors from '../../../../core/store/selectors/game.selectors';
import {AsyncPipe} from '@angular/common';
import * as GameActions from '../../../../core/store/actions/game.actions';

@Component({
  selector: 'app-config',
	imports: [
		AsyncPipe
	],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent {
	private store: Store = inject(Store);
	currentGame$: Observable<Game | null> = this.store.pipe(select(GameSelectors.selectCurrentGame));
	loading$: Observable<boolean> = this.store.pipe(select(GameSelectors.selectLoading));
	error$: Observable<any> = this.store.pipe(select(GameSelectors.selectError));
	players$: Observable<Player[]> = this.store.select(GameSelectors.selectPlayers);

	constructor() {
	}

	onClickAddPoint(player: Player) {
		const points = player.points + 1;
		this.store.dispatch(GameActions.updatePlayerPoints({
			player: { ...player },
			points
		}));
	}

	onClickRemovePoint(player: Player) {
		const points = player.points - 1;
		this.store.dispatch(GameActions.updatePlayerPoints({
			player: { ...player },
			points
		}));
	}

}
