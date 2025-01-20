import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GameType } from '../../models/GameType';

interface GameStats {
  totalPoints: number;
  averagePoints: number;
  totalPlayers: number;
  totalTeams?: number;
  gameType?: GameType;
}

@Component({
  selector: 'app-game-stats',
  standalone: true,
  templateUrl: './game-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatsComponent {
  stats = input.required<GameStats>()

  protected readonly GameType = GameType;
}
