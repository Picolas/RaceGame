import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
	name: string;
	photo: string;
}

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private http = inject(HttpClient);

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>('assets/data/users.json');
	}

	searchUsers(term: string): Observable<User[]> {
		return this.getUsers().pipe(
			map(users => users.filter(user =>
				user.name.toLowerCase().includes(term.toLowerCase())
			))
		);
	}
}
