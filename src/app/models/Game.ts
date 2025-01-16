import {Player} from './Player';
import {GameStatus} from './GameStatus';
import { GameType } from './GameType';
import { Team } from './Team';

export interface Game {
	id: string;
	name: string;
	gameType: GameType;
	teams: Team[] | null;
	players: Player[] | null;
	status: GameStatus;
	createdAt: Date;
}
