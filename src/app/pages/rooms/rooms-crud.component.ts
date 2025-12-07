import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoomService} from '../../services/room.service';
import {RoomModel} from '../../services/model/room.model';
import {HotelService} from '../../services/hotel.service';
import {HotelModel} from '../../services/model/hotel.model';
import {RoomTypeService} from '../../services/room-type.service';
import {RoomTypeModel} from '../../services/model/room.type.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-rooms-crud',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './rooms-crud.component.html',
  styleUrl: './rooms-crud.component.css'
})
export class RoomsCrudComponent implements OnInit {

  rooms: RoomModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedRoom: RoomModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  roomToDelete: RoomModel | null = null;

  // Available options for dropdowns
  allHotels: HotelModel[] = [];
  allRoomTypes: RoomTypeModel[] = [];

  // Filter values
  searchQuery: string = '';
  filterHotel: string = '';
  filters: FilterModel[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc'

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private roomTypeService: RoomTypeService
  ) {
  }

  ngOnInit() {
    this.loadRooms();
    this.loadAllHotels();
    this.loadAllRoomTypes();
  }

  loadRooms() {
    this.updatePaginatedData();
  }

  loadAllHotels() {
    this.hotelService.getAll('').subscribe({
      next: httpResponse => {
        this.allHotels = httpResponse.body || [];
      },
      error: err => {
        console.error('Error loading hotels:', err);
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
      this.removeFilter("number.equals");
      this.filters.push(new FilterModel("number.equals", FieldType.TEXT, this.searchQuery));
    }
    if (this.filterHotel != '') {
      filterEmpty = false;
      this.removeFilter("hotel.id.equals");
      this.filters.push(new FilterModel("hotel.id.equals", FieldType.TEXT, this.filterHotel));
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
    this.roomService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.rooms = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get rooms list:', err);
        alert('Failed to get rooms list. Please try again.');
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
    this.selectedRoom = {
      id: 0,
      number: 0,
      hotel: this.allHotels[0] || {} as HotelModel,
      type: this.allRoomTypes[0] || {} as RoomTypeModel
    };
    this.modalTitle = 'Add Room';
    this.isModalOpen = true;
  }

  openViewModal(room: RoomModel) {
    this.isEditMode = false;
    this.selectedRoom = {...room};
    this.modalTitle = 'Room Details';
    this.isModalOpen = true;
  }

  openEditModal(room: RoomModel) {
    this.isEditMode = true;
    this.selectedRoom = {...room};
    this.modalTitle = 'Edit Room';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRoom = null;
  }

  saveRoom() {
    if (this.selectedRoom) {
      // Validate required fields
      if (!this.selectedRoom.number || !this.selectedRoom.hotel || !this.selectedRoom.type) {
        alert('Please fill in all required fields (Number, Hotel, Type)');
        return;
      }

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedRoom.id || this.selectedRoom.id === 0;
      if (isAddOperation) {
        this.selectedRoom.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.roomService.create(this.selectedRoom)
        : this.roomService.update(this.selectedRoom);

      saveOperation.subscribe({
        next: () => {
          // Reload rooms to reflect changes
          this.loadRooms();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving room:', err);
          alert('Failed to save room. Please try again.');
        }
      });
    }
  }

  openDeleteModal(room: RoomModel) {
    this.roomToDelete = room;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.roomToDelete = null;
  }

  confirmDelete() {
    if (this.roomToDelete && this.roomToDelete.id) {
      this.roomService.delete(this.roomToDelete.id).subscribe({
        next: () => {
          // Reload rooms to reflect changes
          this.loadRooms();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting room:', err);
          alert('Failed to delete room. Please try again.');
        }
      });
    }
  }

  compareHotels(hotel1: HotelModel | null, hotel2: HotelModel | null): boolean {
    return hotel1?.id === hotel2?.id;
  }

  compareRoomTypes(roomType1: RoomTypeModel | null, roomType2: RoomTypeModel | null): boolean {
    return roomType1?.id === roomType2?.id;
  }
}

