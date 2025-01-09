import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { Player } from '../../../../models/Player';
import { GameStore } from '../../../../core/store/game.store';
import { AddPlayerModalComponent } from '../../../../shared/add-player-modal/add-player-modal.component';

@Component({
	selector: 'app-config',
	standalone: true,
	imports: [
		AddPlayerModalComponent
	],
	templateUrl: './config.component.html',
	styleUrl: './config.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent {
	private gameStore = inject(GameStore);
	players = this.gameStore.players;
	game = this.gameStore.game;
	@ViewChild(AddPlayerModalComponent) addPlayerModal!: AddPlayerModalComponent;

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

	showAddPlayerModal() {
		this.addPlayerModal.show();
	}

	onClickEndGame() {
		if (confirm('Êtes-vous sûr de vouloir terminer la partie ?')) {
			this.gameStore.endGame();
		}
	}

	onClickResetPoints() {
		if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les points ?')) {
			this.gameStore.resetPoints();
		}
	}

	onClickRestartGame() {
		if (confirm('Êtes-vous sûr de vouloir relancer la partie ?')) {
			this.gameStore.restartGame();
		}
	}

	onClickRecreateGame() {
		if (confirm('Êtes-vous sûr de vouloir recréer une nouvelle partie ? Toutes les données seront perdues.')) {
			this.gameStore.deleteAndCreateNewGame();
		}
	}
}
