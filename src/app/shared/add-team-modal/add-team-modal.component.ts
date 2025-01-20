import { Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { GameStore } from '../../core/store/game.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team } from '../../models/Team';
import { Role } from '../../models/Role';
import { Coach } from '../../models/Coach';
import { Entity } from '../../models/Entity';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { User, UserService } from '../../core/services/UserService/user.service';

@Component({
	selector: 'app-add-team-modal',
	standalone: true,
	imports: [
		ReactiveFormsModule,
	],
	templateUrl: './add-team-modal.component.html',
	styleUrl: './add-team-modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTeamModalComponent implements OnInit, OnDestroy {
	private gameStore = inject(GameStore);
	private fb = inject(FormBuilder);
	private isVisible = signal(false);
	private userService = inject(UserService);

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
	filteredUsers = signal<User[]>([]);
	private searchSubscriptions: Subscription[] = [];

	ngOnInit() {
		this.setupUserSearch();
	}

	ngOnDestroy() {
		this.searchSubscriptions.forEach(sub => sub.unsubscribe());
	}

	setupUserSearch() {
		const searchSubscription = this.teamForm.get('coach.name')?.valueChanges.pipe(
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
		const coachGroup = this.teamForm.get('coach');
		coachGroup?.patchValue({
			name: user.name,
			hasPhoto: true,
			photo: user.photo,
		});
		this.filteredUsers.set([]);
	}

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
