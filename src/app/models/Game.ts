import {Player} from './Player';
import {GameStatus} from './GameStatus';

export interface Game {
	id: string;
	name: string;
	players: Player[];
	status: GameStatus;
	createdAt: Date;
}
