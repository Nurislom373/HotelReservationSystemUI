import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IconComponent } from '../icons/icons.component';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('profileDropdown', { static: false }) profileDropdown!: ElementRef;
  @ViewChild('profileButton', { static: false }) profileButton!: ElementRef;

  activeRoute: string = '';
  isDropdownOpen: boolean = false;
  isUserManagementOpen: boolean = false;
  isHotelManagementOpen: boolean = false;
  username: string | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Reservations', route: '/reservations', icon: 'calendar' },
    { label: 'Guests', route: '/guests', icon: 'users' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private elementRef: ElementRef
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });

    // Set initial active route
    this.activeRoute = this.router.url;
  }

  ngOnInit() {
    this.username = this.currentUserService.getUsername();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  isActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute.startsWith(route + '/');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDropdownOpen) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeDropdown();
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isDropdownOpen) {
      if (event.key === 'Escape') {
        this.closeDropdown();
      } else if (event.key === 'Enter' && event.target === this.profileButton?.nativeElement) {
        this.toggleDropdown();
      }
    }
  }

  navigateToProfile() {
    this.closeDropdown();
    // Navigate to profile route (create if needed)
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {
    this.closeDropdown();
    // Navigate to settings route (create if needed)
    this.router.navigate(['/settings']);
  }

  toggleUserManagement() {
    this.isUserManagementOpen = !this.isUserManagementOpen;
  }

  toggleHotelManagement() {
    this.isHotelManagementOpen = !this.isHotelManagementOpen;
  }

  logout() {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

