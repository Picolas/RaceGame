import { Component, inject } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink} from '@angular/router';
import { LayoutService } from '../../services/LayoutService/layout.service';
import { GameStore } from '../../store/game.store';
import { GameType } from '../../../models/GameType';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
	protected layoutService: LayoutService = inject(LayoutService);
	protected readonly GameType = GameType;
	private gameStore = inject(GameStore);

	game = this.gameStore.game;

	toggleFluid() {
	  		this.layoutService.toggleFluid();
	  }

	  toggleTeamRace() {
		this.layoutService.toggleTeamRace();
	  }

	toggleTeamLeaderboard() {
		this.layoutService.toggleTeamLeaderboard();
	}
}
