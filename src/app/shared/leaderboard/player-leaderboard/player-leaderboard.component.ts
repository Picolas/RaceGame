import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { BasePlayer } from '../../../models/BasePlayer';
import { BaseLeaderboardComponent } from '../BaseLeaderboardComponent';

@Component({
	selector: 'app-player-leaderboard',
	templateUrl: './player-leaderboard.component.html',
	styleUrl: './player-leaderboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerLeaderboardComponent extends BaseLeaderboardComponent<BasePlayer> {
	players = input<BasePlayer[]>([]);

	constructor() {
		super();
		effect(() => {
			this.entities.set(this.players());
		});
	}
}
