import {
	ChangeDetectionStrategy,
	Component,
	inject,
} from '@angular/core';
import { LeaderboardComponent } from '../../../../shared/leaderboard/leaderboard.component';
import { RaceComponent } from '../../../../shared/race/race.component';
import { RanksPipe } from '../../../../pipes/Ranks/ranks.pipe';
import { GameStore } from '../../../../core/store/game.store';
import { LayoutService } from '../../../../core/services/LayoutService/layout.service';

@Component({
	selector: 'app-board',
	imports: [
		LeaderboardComponent,
		RaceComponent,
		RanksPipe,
	],
	templateUrl: './board.component.html',
	styleUrl: './board.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
	private gameStore = inject(GameStore);
	protected layoutService = inject(LayoutService);
	players = this.gameStore.players;
	game = this.gameStore.game;
}
