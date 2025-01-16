import { Component, inject, signal } from '@angular/core';
import { GameStore } from '../../core/store/game.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasePlayer } from '../../models/BasePlayer';
import { TeamPlayer } from '../../models/TeamPlayer';
import { Role } from '../../models/Role';

@Component({
	selector: 'app-add-player-modal',
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './add-player-modal.component.html',
	styleUrl: './add-player-modal.component.scss'
})
export class AddPlayerModalComponent {
	private gameStore = inject(GameStore);
	private fb = inject(FormBuilder);
	private isVisible = signal(false);
	private currentTeamId = signal<string | undefined>(undefined);

	playerForm: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
		hasPhoto: [false],
		photo: ['']
	});

	visible = this.isVisible.asReadonly();

	show(teamId?: string) {
		this.currentTeamId.set(teamId);
		this.isVisible.set(true);
	}

	hide() {
		this.isVisible.set(false);
		this.currentTeamId.set(undefined);
		this.playerForm.reset();
	}

	onSubmit() {
		if (this.playerForm.valid) {
			const formValue = this.playerForm.value;
			const teamId = this.currentTeamId();

			if (teamId) {
				const teamPlayer: TeamPlayer = {
					id: '',
					name: formValue.name,
					photo: formValue.photo,
					points: 0,
					role: Role.PLAYER,
					teamId: teamId,
					horse: ''
				};
				this.gameStore.addPlayer(teamPlayer, teamId);
			} else {
				const player: BasePlayer = {
					id: '',
					name: formValue.name,
					role: Role.PLAYER,
					photo: formValue.photo,
					points: 0,
					horse: ''
				};
				this.gameStore.addPlayer(player);
			}

			this.hide();
		}
	}
}
