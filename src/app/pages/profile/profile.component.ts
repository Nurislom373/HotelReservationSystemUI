import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icons/icons.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1>Profile</h1>
        <p>Manage your profile information</p>
      </div>
      <div class="profile-content">
        <p>Profile page coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 24px;
    }
    .page-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    .page-header p {
      color: #64748b;
      margin: 0;
    }
    .profile-content {
      margin-top: 24px;
      padding: 24px;
      background: white;
      border-radius: 8px;
    }
  `]
})
export class ProfileComponent {
}

