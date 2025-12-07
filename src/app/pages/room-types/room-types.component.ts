import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomTypeService} from '../../services/room-type.service';
import {RoomTypeModel} from '../../services/model/room.type.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-room-types',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './room-types.component.html',
  styleUrl: './room-types.component.css'
})
export class RoomTypesComponent implements OnInit {

  roomTypes: RoomTypeModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedRoomType: RoomTypeModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  roomTypeToDelete: RoomTypeModel | null = null;

  // Filter values
  searchQuery: string = '';
  filterIsSmoking: string = '';
  isSmokingDropdownOpen: boolean = false;
  filters: FilterModel[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc'

  @ViewChild('smokingDropdown', {static: false}) smokingDropdown?: ElementRef;

  constructor(private roomTypeService: RoomTypeService) {
  }

  ngOnInit() {
    this.loadRoomTypes();
  }

  loadRoomTypes() {
    this.updatePaginatedData();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filterEmpty: boolean = true;
    if (this.searchQuery != '') {
      filterEmpty = false;
      this.removeFilter("name.contains");
      this.filters.push(new FilterModel("name.contains", FieldType.TEXT, this.searchQuery));
    }
    if (this.filterIsSmoking != '') {
      filterEmpty = false;
      this.removeFilter("isSmokingRoom.equals");
      this.filters.push(new FilterModel("isSmokingRoom.equals", FieldType.TEXT, this.filterIsSmoking));
    }

    if (filterEmpty && this.filters.length >= 1) {
      this.filters = [];
    }
    this.updatePaginatedData();
  }

  removeFilter(name: string) {
    this.filters = this.filters.filter(filterModel => {
      return filterModel.name !== name;
    })
  }

  updatePaginatedData() {
    this.roomTypeService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.roomTypes = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get room types list:', err);
        alert('Failed to get room types list. Please try again.');
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
    this.selectedRoomType = {
      id: 0,
      name: '',
      numberBeds: '',
      maxOccupancy: '',
      isSmokingRoom: false
    };
    this.modalTitle = 'Add Room Type';
    this.isModalOpen = true;
  }

  openViewModal(roomType: RoomTypeModel) {
    this.isEditMode = false;
    this.selectedRoomType = {...roomType};
    this.modalTitle = 'Room Type Details';
    this.isModalOpen = true;
  }

  openEditModal(roomType: RoomTypeModel) {
    this.isEditMode = true;
    this.selectedRoomType = {...roomType};
    this.modalTitle = 'Edit Room Type';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRoomType = null;
  }

  saveRoomType() {
    if (this.selectedRoomType) {
      // Validate required fields
      if (!this.selectedRoomType.name || !this.selectedRoomType.numberBeds || !this.selectedRoomType.maxOccupancy) {
        alert('Please fill in all required fields (Name, Number of Beds, Max Occupancy)');
        return;
      }

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedRoomType.id || this.selectedRoomType.id === 0;
      if (isAddOperation) {
        this.selectedRoomType.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.roomTypeService.create(this.selectedRoomType)
        : this.roomTypeService.update(this.selectedRoomType);

      saveOperation.subscribe({
        next: () => {
          // Reload room types to reflect changes
          this.loadRoomTypes();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving room type:', err);
          alert('Failed to save room type. Please try again.');
        }
      });
    }
  }

  openDeleteModal(roomType: RoomTypeModel) {
    this.roomTypeToDelete = roomType;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.roomTypeToDelete = null;
  }

  confirmDelete() {
    if (this.roomTypeToDelete && this.roomTypeToDelete.id) {
      this.roomTypeService.delete(this.roomTypeToDelete.id).subscribe({
        next: () => {
          // Reload room types to reflect changes
          this.loadRoomTypes();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting room type:', err);
          alert('Failed to delete room type. Please try again.');
        }
      });
    }
  }

  toggleSmokingDropdown() {
    this.isSmokingDropdownOpen = !this.isSmokingDropdownOpen;
  }

  closeSmokingDropdown() {
    this.isSmokingDropdownOpen = false;
  }

  selectSmoking(value: string) {
    this.filterIsSmoking = value;
    this.onFilterChange();
    this.closeSmokingDropdown();
  }

  getSmokingLabel(): string {
    if (this.filterIsSmoking === 'true') return 'Smoking';
    if (this.filterIsSmoking === 'false') return 'Non-Smoking';
    return 'All';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isSmokingDropdownOpen && this.smokingDropdown) {
      const clickedInside = this.smokingDropdown.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeSmokingDropdown();
      }
    }
  }
}

