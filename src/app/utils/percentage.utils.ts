import { GameStatus } from '../models/GameStatus';
import { MAX_RACE_PERCENTAGE, RACE_PERCENTAGE_WIN } from '../core/config/config';
import { Game } from '../models/BaseGame';

export function computeLeftPercentage(points: number, maxPoints: number, game?: Game | null): number {
	if (maxPoints === 0) {
		return 0;
	}

	const maxPercentage =
		game?.status === GameStatus.FINISHED ? RACE_PERCENTAGE_WIN : MAX_RACE_PERCENTAGE;

	// Calcul d’un pourcentage exponentiel
	const basePercentage = (points / maxPoints) * maxPercentage;
	const exponentialFactor = 1; // Augmente l’écart entre les positions, old = 1.5
	const adjustedPercentage =
		Math.pow(basePercentage / maxPercentage, exponentialFactor) * maxPercentage;

	// Garantir un minimum d'avancement pour les scores faibles
	const minPercentage = (points / maxPoints) * 20; // 20% de la progression linéaire

	return Math.max(minPercentage, adjustedPercentage);
}
