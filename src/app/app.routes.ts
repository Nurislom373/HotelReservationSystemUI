import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservations/reservations.component').then(m => m.ReservationsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
    canActivate: [authGuard]
  },
  {
    path: 'guests',
    loadComponent: () => import('./pages/guests/guests.component').then(m => m.GuestsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'amenities',
    loadComponent: () => import('./pages/amenities/amenities.component').then(m => m.AmenitiesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'hotels',
    loadComponent: () => import('./pages/hotels/hotels.component').then(m => m.HotelsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'room-types',
    loadComponent: () => import('./pages/room-types/room-types.component').then(m => m.RoomTypesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rooms-crud',
    loadComponent: () => import('./pages/rooms/rooms-crud.component').then(m => m.RoomsCrudComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rate-plans',
    loadComponent: () => import('./pages/rate-plans/rate-plans.component').then(m => m.RatePlansComponent),
    canActivate: [authGuard]
  }
];
