import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icons/icons.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {
  reservations = [
    { id: '1', guest: 'John Doe', room: '101', checkIn: '2024-11-25', checkOut: '2024-11-28', status: 'confirmed' },
    { id: '2', guest: 'Jane Smith', room: '205', checkIn: '2024-11-26', checkOut: '2024-11-30', status: 'pending' },
    { id: '3', guest: 'Bob Johnson', room: '302', checkIn: '2024-11-27', checkOut: '2024-12-01', status: 'confirmed' }
  ];
  
  filteredReservations: any[] = [];
  
  // Filter values
  searchQuery: string = '';
  selectedStatus: string = '';
  isStatusDropdownOpen: boolean = false;

  @ViewChild('statusDropdown', { static: false }) statusDropdown?: ElementRef;

  constructor() {
    this.filteredReservations = [...this.reservations];
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredReservations = this.reservations.filter(reservation => {
      const searchMatch = !this.searchQuery || 
        reservation.guest.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        reservation.room.includes(this.searchQuery);
      const statusMatch = !this.selectedStatus || reservation.status === this.selectedStatus;
      return searchMatch && statusMatch;
    });
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
    if (this.selectedStatus === 'confirmed') return 'Confirmed';
    if (this.selectedStatus === 'pending') return 'Pending';
    return 'Cancelled';
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

