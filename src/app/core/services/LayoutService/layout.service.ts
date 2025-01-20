import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
	isFluid = signal(false);
	showTeamLeaderboard = signal(false);
	showPlayerLeaderboard = signal(false);
	showRace = signal(false);
	showTeamRace = signal(false);

	toggleFluid() {
		this.isFluid.update(value => !value);
	}

	toggleTeamLeaderboard() {
		this.showTeamLeaderboard.update(value => !value);
	}

	togglePlayerLeaderboard() {
		this.showPlayerLeaderboard.update(value => !value);
	}

	toggleRace() {
		this.showRace.update(value => !value);
	}

	toggleTeamRace() {
		this.showTeamRace.update(value => !value);
	}
}
