import {ApplicationConfig, provideZoneChangeDetection, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideStore} from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { gameStore} from './core/store/game.store';
import {GameEffects} from './core/store/effects/game.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: 'light',
            }
        }
    }),
    provideEffects([
		GameEffects
	]),
  gameStore,
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
