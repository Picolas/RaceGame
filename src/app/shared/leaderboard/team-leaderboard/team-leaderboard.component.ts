import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { Team } from '../../../models/Team';
import { BaseLeaderboardComponent } from '../BaseLeaderboardComponent';

@Component({
	selector: 'app-team-leaderboard',
	templateUrl: './team-leaderboard.component.html',
	styleUrl: './team-leaderboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamLeaderboardComponent extends BaseLeaderboardComponent<Team> {
	teams = input<Team[]>([]);

	constructor() {
		super();
		effect(() => {
			this.entities.set(this.teams());
		});
	}
}
