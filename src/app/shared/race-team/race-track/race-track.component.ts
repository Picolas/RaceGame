import { Component, input } from '@angular/core';
import { TeamNameComponent } from './race-name/team-name.component';
import { HorseProgressComponent } from './horse-progress/horse-progress.component';
import { GrassComponent } from '../../grass/grass.component';
import { EndPilonComponent } from '../../end-pilon/end-pilon.component';
import { Game } from '../../../models/BaseGame';
import { Team } from '../../../models/Team';

@Component({
	selector: 'app-race-track',
	standalone: true,
	imports: [TeamNameComponent, HorseProgressComponent, GrassComponent, EndPilonComponent],
	templateUrl: './race-track.component.html',
	styleUrl: './race-track.component.scss'
})
export class RaceTrackComponent {
	team = input.required<Team>();
	allTeams = input.required<Team[]>();
	game = input<Game | null>(null);
	order = input.required<number>();
	isFirst = input.required<boolean>();
	isLast = input.required<boolean>();
	isNotLast = input.required<boolean>();
	movementClass = input.required<string>();
}
