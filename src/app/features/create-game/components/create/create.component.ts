import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { GameStore } from '../../../../core/store/game.store';
import { Router } from '@angular/router';
import { GameType } from '../../../../models/GameType';
import { Entity } from '../../../../models/Entity';

@Component({
	selector: 'app-create',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './create.component.html',
	styleUrl: './create.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
	private gameStore = inject(GameStore);
	private fb = inject(FormBuilder);
	private router = inject(Router);

	GameType = GameType;
	entities = Object.values(Entity);

	gameForm: FormGroup = this.fb.group({
		name: ['Challenge eXalt', [Validators.required]],
		gameType: [GameType.SOLO_PLAYERS, [Validators.required]],
		players: this.fb.array([this.createPlayerForm()]),
		teams: this.fb.array([])
	});

	get players() {
		return this.gameForm.get('players') as FormArray;
	}

	get teams() {
		return this.gameForm.get('teams') as FormArray;
	}

	createPlayerForm() {
		return this.fb.group({
			name: ['', [Validators.required]],
			hasPhoto: [false],
			photo: [''],
			points: [0]
		});
	}

	createTeamForm(): FormGroup {
		return this.fb.group({
			name: ['', [Validators.required]],
			color: ['#000000', [Validators.required]],
			coach: this.fb.group({
				name: ['', [Validators.required]],
				entity: ['', [Validators.required]],
				hasPhoto: [false],
				photo: ['']
			}),
			players: this.fb.array([this.createPlayerForm()])
		});
	}

	addPlayer() {
		if (this.gameForm.get('gameType')?.value === GameType.SOLO_PLAYERS) {
			this.players.push(this.createPlayerForm());
		} else {
			const selectedTeam = this.teams.at(-1);
			if (selectedTeam) {
				(selectedTeam.get('players') as FormArray).push(this.createPlayerForm());
			}
		}
	}

	addTeam() {
		this.teams.push(this.createTeamForm());
	}

	removePlayer(index: number, teamIndex?: number) {
		if (this.gameForm.get('gameType')?.value === GameType.SOLO_PLAYERS) {
			if (this.players.length > 1) {
				this.players.removeAt(index);
			}
		} else if (teamIndex !== undefined) {
			const teamPlayers = this.teams.at(teamIndex).get('players') as FormArray;
			if (teamPlayers.length > 1) {
				teamPlayers.removeAt(index);
			}
		}
	}

	removeTeam(index: number) {
		if (this.teams.length > 1) {
			this.teams.removeAt(index);
		}
	}

	onSubmit() {
		if (this.gameForm.valid) {
			const formValue = this.gameForm.value;

			if (formValue.gameType === GameType.SOLO_PLAYERS) {
				formValue.teams = null;
			} else {
				formValue.players = null;
			}

			this.gameStore.createOrResetGame(formValue);
			this.router.navigate(['/config']);
		}
	}

	onGameTypeChange() {
		const gameType = this.gameForm.get('gameType')?.value;
		if (gameType === GameType.SOLO_PLAYERS) {
			this.teams.clear();
			if (this.players.length === 0) {
				this.players.push(this.createPlayerForm());
			}
		} else {
			this.players.clear();
			if (this.teams.length === 0) {
				this.teams.push(this.createTeamForm());
			}
		}
	}

	getPlayersControls() {
		return (this.gameForm.get('players') as FormArray).controls;
	}

	getTeamsControls() {
		return (this.gameForm.get('teams') as FormArray).controls;
	}

	getTeamPlayersControls(team: AbstractControl) {
		return (team.get('players') as FormArray).controls;
	}

	getTeamIndex(team: AbstractControl): number {
		return this.teams.controls.indexOf(team);
	}
}
