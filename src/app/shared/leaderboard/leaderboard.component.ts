import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BasePlayer } from '../../models/BasePlayer';

@Component({
	selector: 'app-leaderboard',
	templateUrl: './leaderboard.component.html',
	styleUrl: './leaderboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent {
	players = input<BasePlayer[]>([]);

	readonly first = computed(() => this.players()?.length > 0 ? this.players()[0] : null);
	readonly second = computed(() => this.players()?.length > 1 ? this.players()[1] : null);
	readonly third = computed(() => this.players()?.length > 2 ? this.players()[2] : null);
}
