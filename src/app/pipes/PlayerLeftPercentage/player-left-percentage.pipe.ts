import { Pipe, PipeTransform } from '@angular/core';
import { MAX_RACE_PERCENTAGE, RACE_PERCENTAGE_WIN } from '../../core/config/config';
import { GameStatus } from '../../models/GameStatus';
import { BasePlayer } from '../../models/BasePlayer';
import { Game } from '../../models/BaseGame';

@Pipe({
	name: 'playerLeftPercentage'
})
export class PlayerLeftPercentagePipe implements PipeTransform {

	transform(points: number, players: BasePlayer[], game?: Game | null): number {
		const maxPoints = players.length ? Math.max(...players.map(player => player.points)) : 100;

		if (maxPoints === 0) {
			return 0;
		}

		const maxPercentage = game?.status === GameStatus.FINISHED ? RACE_PERCENTAGE_WIN : MAX_RACE_PERCENTAGE;

		// Calcul du pourcentage avec écart exponentiel
		const basePercentage = (points / maxPoints) * maxPercentage;
		const exponentialFactor = 1.5; // Augmente l'écart entre les positions
		const adjustedPercentage = Math.pow(basePercentage / maxPercentage, exponentialFactor) * maxPercentage;

		// Garantir un minimum d'avancement pour les scores faibles
		const minPercentage = (points / maxPoints) * 20; // 20% de la progression linéaire

		return Math.max(minPercentage, adjustedPercentage);
	}

}
