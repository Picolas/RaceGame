import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameStore } from '../../core/store/game.store';
import { Player } from '../../models/Player';
import { PhotoService } from '../../core/services/PhotoService/photo.service';

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
	private fb = inject(FormBuilder);
	private gameStore = inject(GameStore);
	private photoService = inject(PhotoService);
	visible = signal(false);
	playerForm: FormGroup;

	constructor() {
		this.playerForm = this.fb.group({
			name: ['', Validators.required],
			hasPhoto: [false],
			photo: ['', []]//Validators.pattern(/https?:\/\/.+/)
		});
	}

	show() {
		this.visible.set(true);
	}

	hide() {
		this.visible.set(false);
		this.playerForm.reset();
	}

	onSubmit() {
		if (this.playerForm.valid) {
			const photo = this.playerForm.value.hasPhoto ?
				(this.photoService.getPhotoUrlFromInput(this.playerForm.value.photo) || '/assets/img/profile_picture.png') :
				'/assets/img/profile_picture.png';

			const newPlayer: Partial<Player> = {
				name: this.playerForm.value.name,
				photo: photo,
				points: 0
			};
			this.gameStore.addPlayer(newPlayer as Player);
			this.hide();
		}
	}
}
