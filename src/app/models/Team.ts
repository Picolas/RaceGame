import { Coach } from './Coach';
import { TeamPlayer } from './TeamPlayer';

export interface Team {
	id: string;
	name: string;
	points: number;
	color: string;
	coach: Coach;
	players: TeamPlayer[];
}
