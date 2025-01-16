import { Component, input } from '@angular/core';
import { PlayerLeftPercentagePipe } from '../../pipes/PlayerLeftPercentage/player-left-percentage.pipe';
import { BasePlayer } from '../../models/BasePlayer';
import { Game } from '../../models/BaseGame';

@Component({
	selector: 'app-horse-progress',
	standalone: true,
	imports: [PlayerLeftPercentagePipe],
	templateUrl: './horse-progress.component.html',
	styleUrls: ['./horse-progress.component.scss'],
})
export class HorseProgressComponent {
	player = input.required<BasePlayer>();
	allPlayers = input.required<BasePlayer[]>();
	game = input.required<Game | null>();
}
