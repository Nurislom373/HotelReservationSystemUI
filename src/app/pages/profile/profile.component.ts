import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../services/model/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUser: UserModel | null = null;

  // Language options
  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Russian' },
    { value: 'uz', label: 'Uzbek' }
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      langKey: ['en', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getCurrentUserAccount().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.body) {
          this.currentUser = response.body;
          this.populateForm(response.body);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile. Please try again later.';
        console.error('Error loading user profile:', err);
      }
    });
  }

  populateForm(user: UserModel) {
    this.profileForm.patchValue({
      login: user.login || '',
      phoneNumber: user.phoneNumber || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      langKey: user.langKey || 'en'
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.profileForm.value;
    
    // Prepare update payload with only the fields we're displaying
    // Include id if available to ensure proper update
    const updatePayload: any = {
      login: formValue.login,
      phoneNumber: formValue.phoneNumber,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      langKey: formValue.langKey
    };

    // Include id if currentUser exists for proper update
    if (this.currentUser?.id) {
      updatePayload.id = this.currentUser.id;
    }

    // Use the update method which calls api/users/update
    // If your API requires a different endpoint for account updates, adjust accordingly
    this.userService.update(updatePayload).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.body) {
          this.currentUser = response.body;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Failed to update profile. Please try again.';
        console.error('Error updating profile:', err);
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `Must be at least ${minLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      login: 'Login',
      phoneNumber: 'Phone Number',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      langKey: 'Language'
    };
    return labels[fieldName] || fieldName;
  }
}
