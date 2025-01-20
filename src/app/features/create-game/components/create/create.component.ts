import { ChangeDetectionStrategy, Component, inject, OnInit, signal, HostListener, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { GameStore } from '../../../../core/store/game.store';
import { Router } from '@angular/router';
import { GameType } from '../../../../models/GameType';
import { Entity } from '../../../../models/Entity';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { User } from '../../../../core/services/UserService/user.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { EMPTY, Subscription } from 'rxjs';

@Component({
	selector: 'app-create',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './create.component.html',
	styleUrl: './create.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit, OnDestroy {
	private gameStore = inject(GameStore);
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private userService = inject(UserService);

	GameType = GameType;
	entities = Object.values(Entity);
	filteredUsers = signal<User[]>([]);
	activeInput = signal<string | null>(null);

	gameForm: FormGroup = this.fb.group({
		name: ['Challenge eXalt', [Validators.required]],
		gameType: [GameType.SOLO_PLAYERS, [Validators.required]],
		players: this.fb.array([this.createPlayerForm()]),
		teams: this.fb.array([])
	});

	private searchSubscriptions: Subscription[] = [];

	ngOnInit(): void {
		if (this.gameStore.currentGame()) {
			this.router.navigate(['/game']);
		}
		this.setupUserSearch();
	}

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
			this.setupUserSearch();
		} else {
			const selectedTeam = this.teams.at(-1);
			if (selectedTeam) {
				(selectedTeam.get('players') as FormArray).push(this.createPlayerForm());
				this.setupUserSearch();
			}
		}
	}

	addTeam() {
		this.teams.push(this.createTeamForm());
		this.setupUserSearch();
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

	setupUserSearch() {
		this.cleanupSubscriptions();
		const searchSubscription = this.gameForm.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap(() => {
				const activeInput = this.activeInput();
				if (!activeInput) {
					this.filteredUsers.set([]);
					return EMPTY;
				}

				const control = this.findControlByIdentifier(activeInput);
				if (!control) return EMPTY;

				const searchTerm = control.get('name')?.value?.toLowerCase() || '';
				if (!searchTerm) {
					this.filteredUsers.set([]);
					return EMPTY;
				}

				return this.userService.searchUsers(searchTerm);
			})
		).subscribe(users => {
			this.filteredUsers.set(users);
		});

		this.searchSubscriptions.push(searchSubscription);
	}

	private findControlByIdentifier(identifier: string): AbstractControl | null {
		if (!identifier) return null;

		const parts = identifier.split('-');
		if (parts[0] === 'coach') {
			const teamIndex = parseInt(parts[1]);
			return this.teams.get(teamIndex.toString())?.get('coach') as FormGroup;
		} else if (parts[0] === 'team' && parts[2] === 'player') {
			const teamIndex = parseInt(parts[1]);
			const playerIndex = parseInt(parts[3]);
			return this.teams.get(teamIndex.toString())?.get('players')?.get(playerIndex.toString()) as FormGroup;
		} else if (parts[0] === 'player') {
			const playerIndex = parseInt(parts[1]);
			return this.players.get(playerIndex.toString()) as FormGroup;
		}
		return null;
	}

	setActiveInput(identifier: string | null) {
		this.activeInput.set(identifier);
		if (!identifier) {
			this.filteredUsers.set([]);
		}
	}

	selectUser(control: AbstractControl, user: User) {
		const values = {
			name: user.name,
			hasPhoto: true,
			photo: user.photo
		};

		if (control instanceof FormGroup) {
			control.patchValue(values);
		} else {
			const parentGroup = control.parent as FormGroup;
			if (!parentGroup) return;
			parentGroup.patchValue(values);
		}

		this.filteredUsers.set([]);
		this.activeInput.set(null);
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		if (event.key === 'Tab' && this.activeInput() && this.filteredUsers().length > 0) {
			event.preventDefault();
			const firstUser = this.filteredUsers()[0];
			const activeControl = this.findControlByIdentifier(this.activeInput()!);
			if (activeControl && firstUser) {
				this.selectUser(activeControl, firstUser);
			}
		}
	}

	private cleanupSubscriptions() {
		this.searchSubscriptions.forEach(sub => sub.unsubscribe());
		this.searchSubscriptions = [];
	}

	ngOnDestroy() {
		this.cleanupSubscriptions();
	}
}

