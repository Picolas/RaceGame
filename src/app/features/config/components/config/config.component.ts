import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Player } from '../../../../models/Player';
import { GameStore } from '../../../../core/store/game.store';

@Component({
	selector: 'app-config',
	imports: [
	],
	templateUrl: './config.component.html',
	styleUrl: './config.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent {
	private gameStore = inject(GameStore);
	players = this.gameStore.players;

	onClickAddPoint(player: Player) {
		const points = player.points + 1;
		this.gameStore.updatePlayerPoints(player, points);
	}

	onClickRemovePoint(player: Player) {
		const points = player.points - 1;
		if (points >= 0) {
			this.gameStore.updatePlayerPoints(player, points);
		}
	}

	onClickDeletePlayer(player: Player) {
		if (confirm(`Êtes-vous sûr de vouloir supprimer ${player.name} ?`)) {
			this.gameStore.removePlayer(player);
		}
	}
}
