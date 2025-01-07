import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/']
    },
    {
      label: 'Game',
      icon: 'pi pi-fw pi-gamepad',
      routerLink: ['/game']
    },
    {
      label: 'About',
      icon: 'pi pi-fw pi-info',
      routerLink: ['/about']
    }
    ]

}
