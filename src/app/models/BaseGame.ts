import { GameStatus } from './GameStatus';
import { GameType } from './GameType';
import { Team } from './Team';
import { BasePlayer } from './BasePlayer';

export interface BaseGame {
	id: string;
	name: string;
	status: GameStatus;
	createdAt: Date;
}

export type Game =
	| ({
	gameType: GameType.SOLO_PLAYERS;
	players: BasePlayer[];
	teams: null;
} & BaseGame)
	| ({
	gameType: GameType.TEAMS;
	teams: Team[];
	players: null;
} & BaseGame);
