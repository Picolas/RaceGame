import { Component } from '@angular/core';
import {LeaderboardComponent} from '../../../../shared/leaderboard/leaderboard.component';

@Component({
  selector: 'app-board',
	imports: [
		LeaderboardComponent
	],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

}
