import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Game} from '../../../../models/Game';
import {GameStatus} from '../../../../models/GameStatus';
import {NgForOf, NgIf} from '@angular/common';
import { GameStore } from '../../../../core/store/game.store';

@Component({
  selector: 'app-create',
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgIf,
		NgForOf
	],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {
	private fb: FormBuilder = inject(FormBuilder);
	private gameStore = inject(GameStore);
	private router: Router = inject(Router);
	gameForm!: FormGroup;

	ngOnInit() {
		this.gameForm = this.fb.group({
			name: ['', [Validators.minLength(3)]],
			players: this.fb.array([
				this.createPlayerFormGroup()
			])
		})
	}

	createPlayerFormGroup(): FormGroup {
		return this.fb.group({
			name: ['', Validators.required],
			hasPhoto: [false],
			photo: ['', [Validators.pattern(/https?:\/\/.+/)]]
		});
	}

	get players(): FormArray {
		return this.gameForm.get('players') as FormArray;
	}

	addPlayer(): void {
		this.players.push(this.createPlayerFormGroup());
	}

	removePlayer(index: number): void {
		if (this.players.length > 1) {
			this.players.removeAt(index);
		}
	}

	onSubmit(): void {
		console.log(this.gameForm.value);
		if (this.gameForm.valid) {
			const game: Partial<Game> = {
				name: this.gameForm.value.name,
				players: this.gameForm.value.players.map((p: any) => ({
					name: p.name,
					photo: p.hasPhoto ? p.photo : '/assets/img/profile_picture.png',
				})),
				status: GameStatus.CREATED,
			};
			this.gameStore.createOrResetGame({ ...game });

			this.router.navigate(['game']);
		} else {
			this.gameForm.markAllAsTouched();
		}
	}
}
