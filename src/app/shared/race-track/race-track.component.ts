import { Component, input } from '@angular/core';
import { Player } from '../../models/Player';
import { Game } from '../../models/Game';
import { PlayerLeftPercentagePipe } from '../../pipes/PlayerLeftPercentage/player-left-percentage.pipe';

@Component({
	selector: 'app-race-track',
	standalone: true,
	imports: [PlayerLeftPercentagePipe],
	templateUrl: './race-track.component.html',
	styleUrl: './race-track.component.scss'
})
export class RaceTrackComponent {
	player = input.required<Player>();
	allPlayers = input.required<Player[]>();
	game = input<Game | null>();
	order = input.required<number>();
	isFirst = input.required<boolean>();
	isLast = input.required<boolean>();
	isNotLast = input.required<boolean>();
	movementClass = input.required<string>();
}
