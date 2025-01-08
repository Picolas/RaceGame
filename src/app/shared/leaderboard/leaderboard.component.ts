import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Player} from '../../models/Player';

@Component({
  selector: 'app-leaderboard',
	imports: [
	],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent {
	@Input() players: Player[] | null = [];
	first: Player | null = null;
	second: Player | null = null;
	third: Player | null = null;

	ngOnChanges() {
		if (this.players && this.players.length > 0) {
			this.first = this.players[0];
			this.second = this.players[1];
			this.third = this.players[2];
		}
	}
}
