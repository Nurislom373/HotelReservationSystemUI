import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HotelService} from '../../services/hotel.service';
import {HotelModel, HotelType} from '../../services/model/hotel.model';
import {AmenityService} from '../../services/amenity.service';
import {AmenityModel} from '../../services/model/amenity.model';
import {RoomTypeService} from '../../services/room-type.service';
import {RoomTypeModel} from '../../services/model/room.type.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit {

  hotels: HotelModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedHotel: HotelModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  hotelToDelete: HotelModel | null = null;

  // Available options for dropdowns
  allAmenities: AmenityModel[] = [];
  allRoomTypes: RoomTypeModel[] = [];
  hotelTypes = Object.keys(HotelType).filter(key => isNaN(Number(key)));

  // Filter values
  searchQuery: string = '';
  filterPhoneNumber: string = '';
  filterAddress: string = '';
  filters: FilterModel[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc'

  constructor(
    private hotelService: HotelService,
    private amenityService: AmenityService,
    private roomTypeService: RoomTypeService
  ) {
  }

  ngOnInit() {
    this.loadHotels();
    this.loadAllAmenities();
    this.loadAllRoomTypes();
  }

  loadHotels() {
    this.updatePaginatedData();
  }

  loadAllAmenities() {
    this.amenityService.getAll('').subscribe({
      next: httpResponse => {
        this.allAmenities = httpResponse.body || [];
      },
      error: err => {
        console.error('Error loading amenities:', err);
      }
    });
  }

  loadAllRoomTypes() {
    this.roomTypeService.getAll('').subscribe({
      next: httpResponse => {
        this.allRoomTypes = httpResponse.body || [];
      },
      error: err => {
        console.error('Error loading room types:', err);
      }
    });
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
    if (this.filterPhoneNumber != '') {
      filterEmpty = false;
      this.removeFilter("phoneNumber.contains");
      this.filters.push(new FilterModel("phoneNumber.contains", FieldType.TEXT, this.filterPhoneNumber));
    }
    if (this.filterAddress != '') {
      filterEmpty = false;
      this.removeFilter("address.contains");
      this.filters.push(new FilterModel("address.contains", FieldType.TEXT, this.filterAddress));
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
    this.hotelService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.hotels = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get hotels list:', err);
        alert('Failed to get hotels list. Please try again.');
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
    this.selectedHotel = {
      id: 0,
      name: '',
      type: HotelType.LUXURY,
      logoKey: '',
      petAccommodation: false,
      daysOff: [],
      address: '',
      postalCode: '',
      country: '',
      state: '',
      district: '',
      house: '',
      latitude: 0,
      longitude: 0,
      phoneNumber: '',
      amenities: [],
      roomTypes: []
    };
    this.modalTitle = 'Add Hotel';
    this.isModalOpen = true;
  }

  getDaysOffString(): string {
    if (!this.selectedHotel || !this.selectedHotel.daysOff) return '';
    return this.selectedHotel.daysOff.join(', ');
  }

  setDaysOffString(value: string) {
    if (!this.selectedHotel) return;
    this.selectedHotel.daysOff = value.split(',').map(d => d.trim()).filter(d => d.length > 0);
  }

  openViewModal(hotel: HotelModel) {
    this.isEditMode = false;
    this.selectedHotel = {...hotel};
    this.modalTitle = 'Hotel Details';
    this.isModalOpen = true;
  }

  openEditModal(hotel: HotelModel) {
    this.isEditMode = true;
    this.selectedHotel = {...hotel};
    this.modalTitle = 'Edit Hotel';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedHotel = null;
  }

  saveHotel() {
    if (this.selectedHotel) {
      // Validate required fields
      if (!this.selectedHotel.name || !this.selectedHotel.address || !this.selectedHotel.phoneNumber) {
        alert('Please fill in all required fields (Name, Address, Phone Number)');
        return;
      }

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedHotel.id || this.selectedHotel.id === 0;
      if (isAddOperation) {
        this.selectedHotel.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.hotelService.create(this.selectedHotel)
        : this.hotelService.update(this.selectedHotel);

      saveOperation.subscribe({
        next: () => {
          // Reload hotels to reflect changes
          this.loadHotels();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving hotel:', err);
          alert('Failed to save hotel. Please try again.');
        }
      });
    }
  }

  openDeleteModal(hotel: HotelModel) {
    this.hotelToDelete = hotel;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.hotelToDelete = null;
  }

  confirmDelete() {
    if (this.hotelToDelete && this.hotelToDelete.id) {
      this.hotelService.delete(this.hotelToDelete.id).subscribe({
        next: () => {
          // Reload hotels to reflect changes
          this.loadHotels();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting hotel:', err);
          alert('Failed to delete hotel. Please try again.');
        }
      });
    }
  }

  toggleAmenity(amenity: AmenityModel) {
    if (!this.selectedHotel) return;
    const index = this.selectedHotel.amenities.findIndex(a => a.id === amenity.id);
    if (index >= 0) {
      this.selectedHotel.amenities.splice(index, 1);
    } else {
      this.selectedHotel.amenities.push(amenity);
    }
  }

  isAmenitySelected(amenity: AmenityModel): boolean {
    if (!this.selectedHotel) return false;
    return this.selectedHotel.amenities.some(a => a.id === amenity.id);
  }

  toggleRoomType(roomType: RoomTypeModel) {
    if (!this.selectedHotel) return;
    const index = this.selectedHotel.roomTypes.findIndex(rt => rt.id === roomType.id);
    if (index >= 0) {
      this.selectedHotel.roomTypes.splice(index, 1);
    } else {
      this.selectedHotel.roomTypes.push(roomType);
    }
  }

  isRoomTypeSelected(roomType: RoomTypeModel): boolean {
    if (!this.selectedHotel) return false;
    return this.selectedHotel.roomTypes.some(rt => rt.id === roomType.id);
  }

  getHotelTypeLabel(type: HotelType): string {
    return HotelType[type] || '';
  }

  get HotelType() {
    return HotelType;
  }
}

