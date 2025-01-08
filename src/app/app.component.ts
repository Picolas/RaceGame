import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './core/layouts/header/header.component';
import { GameStore } from './core/store/game.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
	private gameStore = inject(GameStore);

	ngOnInit() {
		this.gameStore.loadGame();
	}
}
