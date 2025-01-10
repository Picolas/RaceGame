import { Component, input } from '@angular/core';

@Component({
	selector: 'app-grass',
	standalone: true,
	templateUrl: './grass.component.html',
	styleUrls: ['./grass.component.scss'],
})
export class GrassComponent {
	isFirst = input.required<boolean>();
	isLast = input.required<boolean>();
}
