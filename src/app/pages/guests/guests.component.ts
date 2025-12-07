import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestService, Guest } from '../../services/guest.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from '../../components/icons/icons.component';

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.css'
})
export class GuestsComponent implements OnInit {
  guests: Guest[] = [];
  filteredGuests: Guest[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedGuest: Guest | null = null;
  guestForm: FormGroup;
  isAddMode = false;

  // Filter values
  searchQuery: string = '';
  selectedStatus: string = '';
  isStatusDropdownOpen: boolean = false;

  statusOptions = ['checked-in', 'checked-out', 'upcoming'];

  @ViewChild('statusDropdown', { static: false }) statusDropdown?: ElementRef;

  constructor(
    private guestService: GuestService,
    private fb: FormBuilder
  ) {
    this.guestForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      status: ['upcoming', Validators.required]
    });
  }

  ngOnInit() {
    this.loadGuests();
  }

  loadGuests() {
    this.guestService.getGuests().subscribe(data => {
      this.guests = data;
      this.applyFilters();
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredGuests = this.guests.filter(guest => {
      const searchMatch = !this.searchQuery ||
        guest.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        guest.phone.includes(this.searchQuery);
      const statusMatch = !this.selectedStatus || guest.status === this.selectedStatus;
      return searchMatch && statusMatch;
    });
  }

  openAddModal() {
    this.isAddMode = true;
    this.selectedGuest = null;
    this.modalTitle = 'Add Guest';
    this.guestForm.reset({
      name: '',
      email: '',
      phone: '',
      status: 'upcoming'
    });
    this.isModalOpen = true;
  }

  openViewModal(guest: Guest) {
    this.isAddMode = false;
    this.selectedGuest = guest;
    this.modalTitle = 'Guest Profile';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedGuest = null;
    this.isAddMode = false;
    this.guestForm.reset();
  }

  onSubmit() {
    if (this.guestForm.valid) {
      const formValue = this.guestForm.value;
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        visits: 0,
        status: formValue.status,
        currentRoom: undefined
      };

      // In a real app, this would call a service method to save
      console.log('Saving guest:', newGuest);
      this.guests.push(newGuest);
      this.applyFilters();
      this.closeModal();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.guestForm.controls).forEach(key => {
        this.guestForm.get(key)?.markAsTouched();
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-badge status-${status}`;
  }

  getFieldError(fieldName: string): string {
    const field = this.guestForm.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email') && field?.touched) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('pattern') && field?.touched) {
      return 'Please enter a valid phone number';
    }
    if (field?.hasError('minlength') && field?.touched) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least 2 characters`;
    }
    return '';
  }

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  closeStatusDropdown() {
    this.isStatusDropdownOpen = false;
  }

  selectStatus(value: string) {
    this.selectedStatus = value;
    this.onFilterChange();
    this.closeStatusDropdown();
  }

  getStatusLabel(): string {
    if (!this.selectedStatus) return 'All Status';
    if (this.selectedStatus === 'checked-in') return 'Checked-In';
    if (this.selectedStatus === 'checked-out') return 'Checked-Out';
    return 'Upcoming';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isStatusDropdownOpen && this.statusDropdown) {
      const clickedInside = this.statusDropdown.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeStatusDropdown();
      }
    }
  }
}

