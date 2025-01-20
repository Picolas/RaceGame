import { Component, input } from '@angular/core';
import { Game } from '../../../../models/BaseGame';
import { Team } from '../../../../models/Team';
import { TeamLeftPercentagePipe } from '../../../../pipes/TeamLeftPercentage/team-left-percentage.pipe';

@Component({
	selector: 'app-horse-progress',
	standalone: true,
	imports: [TeamLeftPercentagePipe],
	templateUrl: './horse-progress.component.html',
	styleUrls: ['./horse-progress.component.scss'],
})
export class HorseProgressComponent {
	team = input.required<Team>();
	allTeams = input.required<Team[]>();
	game = input.required<Game | null>();
}
