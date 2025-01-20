import { Component, input } from '@angular/core';
import { PlayerNameComponent } from './player-name/player-name.component';
import { HorseProgressComponent } from './horse-progress/horse-progress.component';
import { GrassComponent } from '../../grass/grass.component';
import { EndPilonComponent } from '../../end-pilon/end-pilon.component';
import { BasePlayer } from '../../../models/BasePlayer';
import { Game } from '../../../models/BaseGame';

@Component({
	selector: 'app-race-track',
	standalone: true,
	imports: [PlayerNameComponent, HorseProgressComponent, GrassComponent, EndPilonComponent],
	templateUrl: './race-track.component.html',
	styleUrl: './race-track.component.scss'
})
export class RaceTrackComponent {
	player = input.required<BasePlayer>();
	allPlayers = input.required<BasePlayer[]>();
	game = input<Game | null>(null);
	order = input.required<number>();
	isFirst = input.required<boolean>();
	isLast = input.required<boolean>();
	isNotLast = input.required<boolean>();
	movementClass = input.required<string>();
}
