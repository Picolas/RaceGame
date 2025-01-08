import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {
	private storageSubject = new Subject<{ key: string, value: any }>();
	public storageChange$ = this.storageSubject.asObservable();

	constructor() {
		window.addEventListener('storage', (event) => {
			if (event.key) {
				this.storageSubject.next({
					key: event.key,
					value: event.newValue ? JSON.parse(event.newValue) : null
				});
			}
		});
	}

	getItem<T>(key: string): T | null {
		const item = localStorage.getItem(key);
		return item ? (JSON.parse(item) as T) : null;
	}

	setItem<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
		this.storageSubject.next({ key, value });
	}

	removeItem(key: string): void {
		localStorage.removeItem(key);
		this.storageSubject.next({ key, value: null });
	}

	clear(): void {
		localStorage.clear();
		this.storageSubject.next({ key: '', value: null });
	}
}
