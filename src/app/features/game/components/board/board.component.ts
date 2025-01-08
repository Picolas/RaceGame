import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit,
} from '@angular/core';
import {LeaderboardComponent} from '../../../../shared/leaderboard/leaderboard.component';
import {Store} from '@ngrx/store';
import * as GameSelectors from '../../../../core/store/selectors/game.selectors';
import * as GameActions from '../../../../core/store/actions/game.actions';
import {RaceComponent} from '../../../../shared/race/race.component';
import {AsyncPipe} from '@angular/common';
import {RanksPipe} from '../../../../pipes/Ranks/ranks.pipe';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-board',
	imports: [
		LeaderboardComponent,
		RaceComponent,
		AsyncPipe,
		RanksPipe,
	],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
	private store: Store = inject(Store);
	players$ = this.store.select(GameSelectors.selectPlayers);

	ngOnInit() {
		this.store.dispatch(GameActions.loadGame());
	}
}
