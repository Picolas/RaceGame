import { Component, inject, signal } from '@angular/core';
import { GameStore } from '../../core/store/game.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../models/Team';
import { Role } from '../../models/Role';
import { Coach } from '../../models/Coach';
import { Entity } from '../../models/Entity';

@Component({
	selector: 'app-add-team-modal',
	standalone: true,
	imports: [
		ReactiveFormsModule,
	],
	templateUrl: './add-team-modal.component.html',
	styleUrl: './add-team-modal.component.scss'
})
export class AddTeamModalComponent {
	private gameStore = inject(GameStore);
	private fb = inject(FormBuilder);
	private isVisible = signal(false);

	entities = Object.values(Entity);

	teamForm: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
		color: ['#000000', [Validators.required]],
		coach: this.fb.group({
			name: ['', [Validators.required]],
			entity: ['', [Validators.required]],
			hasPhoto: [false],
			photo: ['']
		})
	});

	visible = this.isVisible.asReadonly();

	show() {
		this.isVisible.set(true);
	}

	hide() {
		this.isVisible.set(false);
		this.teamForm.reset({ color: '#000000' });
	}

	onSubmit() {
		if (this.teamForm.valid) {
			const formValue = this.teamForm.value;
			const team: Partial<Team> = {
				name: formValue.name,
				color: formValue.color,
				coach: {
					name: formValue.coach.name,
					entity: formValue.coach.entity,
					photo: formValue.coach.hasPhoto ? formValue.coach.photo : '/assets/img/profile_picture.png',
					id: '',
					role: Role.COACH,
					teamId: ''
				} as Coach
			};

			this.gameStore.addTeam(team);
			this.hide();
		}
	}
}
