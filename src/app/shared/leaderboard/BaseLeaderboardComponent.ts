import { computed, signal } from '@angular/core';

/**
 * Classe de base pour gérer le tri et la sélection des 3 premiers éléments
 * de type T (T doit au moins avoir la propriété `points`).
 */
export abstract class BaseLeaderboardComponent<T extends { points: number }> {
	// Signal pour la liste d'entités (joueurs ou équipes)
	protected entities = signal<T[]>([]);

	// Tri décroissant sur base de points
	readonly sortedEntities = computed<T[]>(() => {
		return [...this.entities()].sort((a, b) => b.points - a.points);
	});

	readonly first = computed<T | null>(() => {
		const list = this.sortedEntities();
		return list.length > 0 ? list[0] : null;
	});

	readonly second = computed<T | null>(() => {
		const list = this.sortedEntities();
		return list.length > 1 ? list[1] : null;
	});

	readonly third = computed<T | null>(() => {
		const list = this.sortedEntities();
		return list.length > 2 ? list[2] : null;
	});
}
