import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./features/game/game.module').then(m => m.GameModule)
  },
  {
    path: '*',
    redirectTo: 'game'
  }
];
