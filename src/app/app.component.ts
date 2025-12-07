import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hotel-admin';
  showSidebar = false;

  constructor(private router: Router) {
    // Check if current route is login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showSidebar = event.url !== '/login' && !event.url.startsWith('/login');
      });
    
    // Set initial state
    this.showSidebar = this.router.url !== '/login' && !this.router.url.startsWith('/login');
  }
}
