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
}
