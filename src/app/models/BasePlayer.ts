import { Role } from './Role';

export interface BasePlayer {
	id: string;
	name: string;
	photo: string;
	points: number;
	horse: string | null;
	role: Role.PLAYER;
}
