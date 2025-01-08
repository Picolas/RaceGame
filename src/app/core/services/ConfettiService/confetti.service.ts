import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
	providedIn: 'root'
})
export class ConfettiService {

	fireworks() {
		const duration = 1000 * 60 * 5; // 5 minute
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
		const interval = setInterval(() => {
			let timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			let particleCount = 50 * (timeLeft / duration);

			confetti({ ...defaults, particleCount, origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
			confetti({ ...defaults, particleCount, origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
		}, 250);
	}

	private randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	launchAt(x: number, y: number) {
		confetti({
			particleCount: 100,
			spread: 100,
			startVelocity: 20,
			origin: {
				x: x / window.innerWidth,
				y: y / window.innerHeight
			},
			colors: ['#5853FF', '#2F2F9B', '#FF2C9B', '#FFDA3E', '#465EA8', '#37358A', '#E8318A', '#FFDC00'],
			ticks: 200,
			gravity: 0.2,
			scalar: 0.8,
		});
	}
}
