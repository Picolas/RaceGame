import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import {Player} from '../../models/Player';
import {NgClass} from '@angular/common';
import {PlayerLeftPercentagePipe} from '../../pipes/PlayerLeftPercentage/player-left-percentage.pipe';

@Component({
  selector: 'app-race',
	imports: [
		NgClass,
		PlayerLeftPercentagePipe
	],
  templateUrl: './race.component.html',
  styleUrl: './race.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceComponent {
	players = input<Player[]>([]);
}
