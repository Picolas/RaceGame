import { Component, input } from '@angular/core';
import { PlayerLeftPercentagePipe } from '../../pipes/PlayerLeftPercentage/player-left-percentage.pipe';
import { Player } from '../../models/Player';
import { Game } from '../../models/Game';

@Component({
	selector: 'app-horse-progress',
	standalone: true,
	imports: [PlayerLeftPercentagePipe],
	templateUrl: './horse-progress.component.html',
	styleUrls: ['./horse-progress.component.scss'],
})
export class HorseProgressComponent {
	player = input.required<Player>();
	allPlayers = input.required<Player[]>();
	game = input.required<Game | null>();
}
