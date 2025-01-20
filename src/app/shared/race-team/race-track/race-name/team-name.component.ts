import { Component, input } from '@angular/core';
import { Team } from '../../../../models/Team';

@Component({
  selector: 'app-team-name',
  imports: [],
  templateUrl: './team-name.component.html',
  styleUrl: './team-name.component.scss'
})
export class TeamNameComponent {
	team = input.required<Team>();
	isFirst = input.required<boolean>();
	isLast = input.required<boolean>();
	isNotLast = input.required<boolean>();
	movementClass = input.required<string>();
}
