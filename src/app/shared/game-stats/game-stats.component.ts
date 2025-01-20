import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameType } from '../../models/GameType';

interface GameStats {
  totalPoints: number;
  averagePoints: number;
  totalPlayers: number;
  totalTeams?: number;
}

@Component({
  selector: 'app-game-stats',
  standalone: true,
  templateUrl: './game-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatsComponent {
  @Input() stats!: GameStats;
  @Input() gameType!: GameType;

  protected readonly GameType = GameType;
}
