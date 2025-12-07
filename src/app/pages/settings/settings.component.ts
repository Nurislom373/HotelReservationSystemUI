import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icons/icons.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h1>Settings</h1>
        <p>Manage your application settings</p>
      </div>
      <div class="settings-content">
        <p>Settings page coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
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
    .settings-content {
      margin-top: 24px;
      padding: 24px;
      background: white;
      border-radius: 8px;
    }
  `]
})
export class SettingsComponent {
}

