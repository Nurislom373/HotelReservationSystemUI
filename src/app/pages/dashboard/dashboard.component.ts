import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icons/icons.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    { label: 'Total Rooms', value: '120', icon: 'home', color: '#14b8a6' },
    { label: 'Occupied', value: '85', icon: 'check-circle', color: '#10b981' },
    { label: 'Available', value: '35', icon: 'circle', color: '#3b82f6' },
    { label: 'Total Guests', value: '245', icon: 'users', color: '#8b5cf6' }
  ];
}

