import { Component, inject, signal, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { GameStore } from '../../core/store/game.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasePlayer } from '../../models/BasePlayer';
import { TeamPlayer } from '../../models/TeamPlayer';
import { Role } from '../../models/Role';
import { EMPTY, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { User, UserService } from '../../core/services/UserService/user.service';

@Component({
	selector: 'app-add-player-modal',
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './add-player-modal.component.html',
	styleUrl: './add-player-modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPlayerModalComponent implements OnInit, OnDestroy {
	private gameStore = inject(GameStore);
	private fb = inject(FormBuilder);
	private isVisible = signal(false);
	private currentTeamId = signal<string | undefined>(undefined);
	private userService = inject(UserService);
	private searchSubscriptions: Subscription[] = [];

	playerForm: FormGroup = this.fb.group({
		name: ['', [Validators.required]],
		hasPhoto: [false],
		photo: ['']
	});

	visible = this.isVisible.asReadonly();
	filteredUsers = signal<User[]>([]);

	constructor() {
		this.setupUserSearch();
	}

	ngOnInit() {
		this.setupUserSearch();
	}

	ngOnDestroy() {
		this.searchSubscriptions.forEach(sub => sub.unsubscribe());
	}

	setupUserSearch() {
		const searchSubscription = this.playerForm.get('name')?.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap(value => {
				if (!value) {
					this.filteredUsers.set([]);
					return EMPTY;
				}
				return this.userService.searchUsers(value.toLowerCase());
			})
		).subscribe(users => {
			this.filteredUsers.set(users);
		});

		if (searchSubscription) {
			this.searchSubscriptions.push(searchSubscription);
		}
	}

	selectUser(user: User) {
		this.playerForm.patchValue({
			name: user.name,
			hasPhoto: true,
			photo: user.photo
		});
		this.filteredUsers.set([]);
	}

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
