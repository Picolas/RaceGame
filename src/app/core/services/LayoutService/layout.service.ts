import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
	isFluid = signal(false);

	toggleFluid() {
		this.isFluid.update(value => !value);
	}
}
