import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
	providedIn: 'root'
})
export class ConfettiService {
	private activeFireworks: (confetti.CreateTypes | { reset: () => void })[] = [];
	private confettiColors = ['#5853FF', '#2F2F9B', '#FF2C9B', '#FFDA3E', '#465EA8', '#37358A', '#E8318A', '#FFDC00'];

	launchAt(x: number, y: number) {
		confetti({
			particleCount: 100,
			spread: 100,
			startVelocity: 20,
			origin: {
				x: x / window.innerWidth,
				y: y / window.innerHeight
			},
			colors: this.confettiColors,
			ticks: 200,
			gravity: 0.2,
			scalar: 0.8,
		});
	}

	fireworks() {
		this.clearFireworks();
		const duration = 1000 * 20; // 20 seconds
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: this.confettiColors };

		const interval: any = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				this.clearFireworks();
				return;
			}

			const particleCount = 50 * (timeLeft / duration);
			this.activeFireworks.push(
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
				}) as any,
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
				}) as any
			);
		}, 250);

		this.activeFireworks.push({ reset: () => clearInterval(interval) });
	}

	clearFireworks() {
		this.activeFireworks.forEach(firework => firework.reset?.());
		this.activeFireworks = [];
		confetti.reset();
	}

	schoolPride() {
		this.clearFireworks();
		const duration = 1000 * 20; // 20 seconds
		const end = Date.now() + duration;

		const animate = () => {
			confetti({
				particleCount: 3,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: this.confettiColors
			});

			confetti({
				particleCount: 3,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: this.confettiColors
			});

			if (Date.now() < end) {
				const animationFrame = requestAnimationFrame(animate);
				this.activeFireworks.push({ reset: () => cancelAnimationFrame(animationFrame) } as any);
			}
		};

		animate();
	}
}

function randomInRange(min: number, max: number) {
	return Math.random() * (max - min) + min;
}
