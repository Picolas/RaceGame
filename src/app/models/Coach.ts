import { Entity } from './Entity';
import { Role } from './Role';

export interface Coach {
	id: string;
	name: string;
	photo: string;
	entity: Entity;
	role: Role.COACH;
	teamId: string;
}
