import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReservationsService} from '../../services/reservations.service';
import {ReservationModel, ReservationStatus} from '../../services/model/reservation.model';
import {RoomService} from '../../services/room.service';
import {RoomModel} from '../../services/model/room.model';
import {ReservationUserModel} from '../../services/model/reservation.user.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservations: ReservationModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedReservation: ReservationModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  reservationToDelete: ReservationModel | null = null;

  // Available options for dropdowns
  allRooms: RoomModel[] = [];
  allUsers: ReservationUserModel[] = [];

  // Filter values
  searchQuery: string = '';
  filterStatus: string = '';
  filters: FilterModel[] = [];
  isStatusDropdownOpen: boolean = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc';

  // Status enum values
  reservationStatuses = Object.values(ReservationStatus);

  @ViewChild('statusDropdown', { static: false }) statusDropdown?: ElementRef;

  constructor(
    private reservationsService: ReservationsService,
    private roomService: RoomService
  ) {
  }

  ngOnInit() {
    this.loadReservations();
    this.loadAllRooms();
    this.loadAllUsers();
  }

  loadReservations() {
    this.updatePaginatedData();
  }

  loadAllRooms() {
    this.roomService.getAll('').subscribe({
      next: httpResponse => {
        this.allRooms = httpResponse.body || [];
      },
      error: err => {
        console.error('Error loading rooms:', err);
      }
    });
  }

  loadAllUsers() {
    // For now, we'll use mock users. In a real implementation, you would fetch from a user/guest service
    this.allUsers = [
      { id: 1, name: 'Noah Thomas' },
      { id: 2, name: 'Adam Leonard' },
      { id: 3, name: 'Agnes Frazier' },
      { id: 4, name: 'Daniel Carlson' },
      { id: 5, name: 'Sarah Johnson' },
      { id: 6, name: 'Michael Chen' }
    ];
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filterEmpty: boolean = true;
    this.filters = [];

    if (this.searchQuery != '') {
      filterEmpty = false;
      // Search by user name or room number
      this.filters.push(new FilterModel("user.name.contains", FieldType.TEXT, this.searchQuery));
    }

    if (this.filterStatus != '') {
      filterEmpty = false;
      this.filters.push(new FilterModel("status.equals", FieldType.TEXT, this.filterStatus));
    }

    this.updatePaginatedData();
  }

  updatePaginatedData() {
    this.reservationsService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        const reservations = httpResponse.body || [];
        // Convert date strings to Date objects
        this.reservations = reservations.map(res => ({
          ...res,
          checkInDate: res.checkInDate ? new Date(res.checkInDate) : new Date(),
          checkOutDate: res.checkOutDate ? new Date(res.checkOutDate) : new Date()
        }));
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get reservations list:', err);
        alert('Failed to get reservations list. Please try again.');
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  openAddModal() {
    this.isEditMode = true;
    this.selectedReservation = {
      id: undefined,
      checkInDate: new Date(),
      checkOutDate: new Date(),
      totalPrice: 0,
      status: ReservationStatus.NEW,
      user: this.allUsers[0] || { id: 0, name: '' },
      room: this.allRooms[0] || {} as RoomModel
    };
    this.modalTitle = 'Add Reservation';
    this.isModalOpen = true;
  }

  openViewModal(reservation: ReservationModel) {
    this.isEditMode = false;
    this.selectedReservation = {...reservation};
    this.modalTitle = 'Reservation Details';
    this.isModalOpen = true;
  }

  openEditModal(reservation: ReservationModel) {
    this.isEditMode = true;
    this.selectedReservation = {...reservation};
    this.modalTitle = 'Edit Reservation';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedReservation = null;
  }

  saveReservation() {
    if (this.selectedReservation) {
      // Validate required fields
      if (!this.selectedReservation.checkInDate || !this.selectedReservation.checkOutDate ||
          !this.selectedReservation.user || !this.selectedReservation.room) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate dates
      if (this.selectedReservation.checkOutDate <= this.selectedReservation.checkInDate) {
        alert('Check-out date must be after check-in date');
        return;
      }

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedReservation.id || this.selectedReservation.id === 0;
      if (isAddOperation) {
        this.selectedReservation.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.reservationsService.create(this.selectedReservation)
        : this.reservationsService.update(this.selectedReservation);

      saveOperation.subscribe({
        next: () => {
          // Reload reservations to reflect changes
          this.loadReservations();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving reservation:', err);
          alert('Failed to save reservation. Please try again.');
        }
      });
    }
  }

  openDeleteModal(reservation: ReservationModel) {
    this.reservationToDelete = reservation;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.reservationToDelete = null;
  }

  confirmDelete() {
    if (this.reservationToDelete && this.reservationToDelete.id) {
      this.reservationsService.delete(this.reservationToDelete.id).subscribe({
        next: () => {
          // Reload reservations to reflect changes
          this.loadReservations();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting reservation:', err);
          alert('Failed to delete reservation. Please try again.');
        }
      });
    }
  }

  compareRooms(room1: RoomModel | null, room2: RoomModel | null): boolean {
    return room1?.id === room2?.id;
  }

  compareUsers(user1: ReservationUserModel | null, user2: ReservationUserModel | null): boolean {
    return user1?.id === user2?.id;
  }

  getStatusLabel(status: ReservationStatus): string {
    return status.replace(/_/g, ' ');
  }

  getStatusClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.ACTIVE:
        return 'active';
      case ReservationStatus.NEW:
        return 'new';
      case ReservationStatus.NOT_ACTIVE:
        return 'not-active';
      default:
        return '';
    }
  }

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  closeStatusDropdown() {
    this.isStatusDropdownOpen = false;
  }

  selectStatus(value: string) {
    this.filterStatus = value;
    this.onFilterChange();
    this.closeStatusDropdown();
  }

  getStatusFilterLabel(): string {
    if (!this.filterStatus) return 'All Status';
    return this.getStatusLabel(this.filterStatus as ReservationStatus);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getDateString(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCheckInDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value && this.selectedReservation) {
      this.selectedReservation.checkInDate = new Date(input.value);
    }
  }

  onCheckOutDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value && this.selectedReservation) {
      this.selectedReservation.checkOutDate = new Date(input.value);
    }
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
