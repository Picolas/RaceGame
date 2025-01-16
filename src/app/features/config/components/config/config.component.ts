import { Component, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStore } from '../../../../core/store/game.store';
import { PaginationService } from '../../../../core/services/PaginationService/pagination.service';
import { AddPlayerModalComponent } from '../../../../shared/add-player-modal/add-player-modal.component';
import { AddTeamModalComponent } from '../../../../shared/add-team-modal/add-team-modal.component';
import { GameType } from '../../../../models/GameType';
import { Team } from '../../../../models/Team';
import { TeamPlayer } from '../../../../models/TeamPlayer';
import { BasePlayer } from '../../../../models/BasePlayer';

@Component({
	selector: 'app-config',
	standalone: true,
	imports: [
		AddPlayerModalComponent,
		AddTeamModalComponent,
		ReactiveFormsModule
	],
	templateUrl: './config.component.html',
	styleUrl: './config.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent {
	private gameStore = inject(GameStore);
	private paginationService = inject(PaginationService);
	private fb = inject(FormBuilder);
	private router = inject(Router);

	players = this.gameStore.players;
	teams = this.gameStore.teams;
	game = this.gameStore.game;
	GameType = GameType;

	@ViewChild(AddPlayerModalComponent) addPlayerModal!: AddPlayerModalComponent;
	@ViewChild(AddTeamModalComponent) addTeamModal!: AddTeamModalComponent;

	paginationForm: FormGroup = this.fb.group({
		firstPageSize: [this.paginationService.getFirstPageSize(), [Validators.required, Validators.min(1)]],
		otherPagesSize: [this.paginationService.getOtherPagesSize(), [Validators.required, Validators.min(1)]]
	});

	onPaginationSubmit() {
		if (this.paginationForm.valid) {
			const { firstPageSize, otherPagesSize } = this.paginationForm.value;
			this.paginationService.updatePageSizes(firstPageSize, otherPagesSize);
		}
	}

	onClickAddPoint(player: BasePlayer) {
		const points = player.points + 1;
		this.gameStore.updatePlayerPoints(player, points);
	}

	onClickRemovePoint(player: BasePlayer) {
		const points = player.points - 1;
		if (points >= 0) {
			this.gameStore.updatePlayerPoints(player, points);
		}
	}

	onClickDeletePlayer(player: BasePlayer) {
		if (confirm(`Êtes-vous sûr de vouloir supprimer ${player.name} ?`)) {
			this.gameStore.removePlayer(player);
		}
	}

	onClickDeleteTeam(team: Team) {
		if (confirm(`Êtes-vous sûr de vouloir supprimer l'équipe ${team.name} ?`)) {
			this.gameStore.removeTeam(team);
		}
	}

	onClickDeleteTeamPlayer(player: TeamPlayer) {
		if (confirm(`Êtes-vous sûr de vouloir supprimer ${player.name} ?`)) {
			this.gameStore.removePlayer(player);
		}
	}

	onClickResetPoints() {
		if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les points ?')) {
			this.gameStore.resetPoints();
		}
	}

	onClickEndGame() {
		if (confirm('Êtes-vous sûr de vouloir terminer la partie ?')) {
			this.gameStore.endGame();
		}
	}

	onClickRestartGame() {
		if (confirm('Êtes-vous sûr de vouloir relancer la partie ?')) {
			this.gameStore.restartGame();
		}
	}

	onClickRecreateGame() {
		if (confirm('Êtes-vous sûr de vouloir recréer une partie ?')) {
			this.gameStore.deleteAndCreateNewGame();
		}
	}

	showAddTeamModal() {
		this.addTeamModal.show();
	}

	showAddPlayerModal(teamId?: string) {
		this.addPlayerModal.show(teamId);
	}
}
