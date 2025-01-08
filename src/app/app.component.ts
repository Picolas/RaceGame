import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './core/layouts/header/header.component';
import {Store} from '@ngrx/store';
import * as GameActions from './core/store/actions/game.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
	private store: Store = inject(Store);

	ngOnInit() {
		this.store.dispatch(GameActions.loadGame());
	}
}
