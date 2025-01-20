import { Component, input } from '@angular/core';
import { BasePlayer } from '../../../../models/BasePlayer';

@Component({
  selector: 'app-player-name',
  imports: [],
  templateUrl: './player-name.component.html',
  styleUrl: './player-name.component.scss'
})
export class PlayerNameComponent {
	player = input.required<BasePlayer>();
	isFirst = input.required<boolean>();
	isLast = input.required<boolean>();
	isNotLast = input.required<boolean>();
	movementClass = input.required<string>();
}
