import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { GameStore } from '../../../../core/store/game.store';
import { PaginationService } from '../../../../core/services/PaginationService/pagination.service';
import { computed } from '@angular/core';
import { RaceComponent } from '../../../../shared/race/race.component';
import { PlayerLeaderboardComponent } from '../../../../shared/leaderboard/player-leaderboard/player-leaderboard.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { LayoutService } from '../../../../core/services/LayoutService/layout.service';
import { RaceTeamComponent } from '../../../../shared/race-team/race-team.component';
import { TeamLeaderboardComponent } from '../../../../shared/leaderboard/team-leaderboard/team-leaderboard.component';
import { GameStatsComponent } from '../../../../shared/game-stats/game-stats.component';
import { GameType } from '../../../../models/GameType';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    RaceComponent,
    PlayerLeaderboardComponent,
    RaceTeamComponent,
    TeamLeaderboardComponent,
    GameStatsComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
  private route = inject(ActivatedRoute);
  private gameStore = inject(GameStore);
  private paginationService = inject(PaginationService);
  protected layoutService = inject(LayoutService);

  players = this.gameStore.players;
  teams = this.gameStore.teams;
  game = this.gameStore.game;

  sortedPlayers = computed(() => {
    return [...this.players()].sort((a, b) => b.points - a.points);
  });

  currentPage = toSignal(
    this.route.paramMap.pipe(
      map(params => parseInt(params.get('page') || '1', 10))
    ),
    { initialValue: 1 }
  );

  pagedPlayers = computed(() => {
    return this.paginationService.getPagedPlayers(this.players(), this.currentPage());
  });

  showLeaderboard = computed(() => this.currentPage() === 1);

  pageNumbers = computed(() => {
    const total = this.paginationService.getTotalPages(this.players());
    return Array.from({ length: total }, (_, i) => i + 1);
  });

	protected readonly stats = computed(() => {
		const game = this.game();
		if (!game) return { totalPoints: 0, averagePoints: 0, totalPlayers: 0, gameType: GameType.SOLO_PLAYERS };

		if (game.gameType === GameType.SOLO_PLAYERS) {
			const totalPoints = this.players().reduce((sum, p) => sum + p.points, 0);
			const totalPlayers = this.players().length;
			return {
				totalPoints,
				averagePoints: totalPlayers ? Math.round(totalPoints / totalPlayers) : 0,
				totalPlayers,
				gameType: game.gameType
			};
		} else {
			const totalPoints = this.teams().reduce((sum, t) => sum + t.points, 0);
			const totalPlayers = this.teams().reduce((sum, t) => sum + t.players.length, 0);
			return {
				totalPoints,
				averagePoints: totalPlayers ? Math.round(totalPoints / totalPlayers) : 0,
				totalPlayers,
				totalTeams: this.teams().length,
				gameType: game.gameType
			};
		}
	});
}
