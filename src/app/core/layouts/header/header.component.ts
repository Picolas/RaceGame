import { Component, inject } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink} from '@angular/router';
import { LayoutService } from '../../services/LayoutService/layout.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
	protected layoutService: LayoutService = inject(LayoutService);

	toggleFluid() {
	  		this.layoutService.toggleFluid();
	  }
}
