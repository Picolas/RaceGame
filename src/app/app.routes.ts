import { Routes } from '@angular/router';
import { GameExistsGuard } from './guards/GameExists/game-exists.guard';

export const routes: Routes = [
	{
		path: 'game',
		loadComponent: () => import('./features/game/components/game/game.component').then(m => m.GameComponent),
		canActivate: [GameExistsGuard]
	},
	{
		path: 'game/page/:page',
		loadComponent: () => import('./features/game/components/game/game.component').then(m => m.GameComponent),
		canActivate: [GameExistsGuard]
	},
	{
		path: 'create-game',
		loadComponent: () => import('./features/create-game/components/create/create.component').then(c => c.CreateComponent)
	},
	{
		path: 'config',
		loadComponent: () => import('./features/config/components/config/config.component').then(c => c.ConfigComponent),
		canActivate: [GameExistsGuard]
	},
	{
		path: '**',
		redirectTo: 'game'
	}
];
