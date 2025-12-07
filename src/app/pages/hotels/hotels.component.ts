import {Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HotelService} from '../../services/hotel.service';
import {HotelModel, HotelType} from '../../services/model/hotel.model';
import {AmenityService} from '../../services/amenity.service';
import {AmenityModel} from '../../services/model/amenity.model';
import {RoomTypeService} from '../../services/room-type.service';
import {RoomTypeModel} from '../../services/model/room.type.model';
import {DayOffType} from '../../services/model/day.off.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';
import * as L from 'leaflet';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit, AfterViewInit, OnDestroy {

  hotels: HotelModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedHotel: HotelModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  hotelToDelete: HotelModel | null = null;

  // Map properties
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map: L.Map | null = null;
  marker: L.Marker | null = null;
  isMapLoading = false;

  // Available options for dropdowns
  allAmenities: AmenityModel[] = [];
  allRoomTypes: RoomTypeModel[] = [];
  hotelTypes = Object.keys(HotelType).filter(key => isNaN(Number(key)));

  // Multi-select properties for Amenities
  amenitySearchQuery: string = '';
  isAmenityDropdownOpen: boolean = false;

  // Multi-select properties for Room Types
  roomTypeSearchQuery: string = '';
  isRoomTypeDropdownOpen: boolean = false;

  // Multi-select properties for Days Off
  daysOffSearchQuery: string = '';
  isDaysOffDropdownOpen: boolean = false;
  availableDaysOff: DayOffType[] = Object.values(DayOffType);

  @ViewChild('amenityDropdown', {static: false}) amenityDropdown?: ElementRef;
  @ViewChild('roomTypeDropdown', {static: false}) roomTypeDropdown?: ElementRef;
  @ViewChild('daysOffDropdown', {static: false}) daysOffDropdown?: ElementRef;

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
    private roomTypeService: RoomTypeService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.loadHotels();
    this.loadAllAmenities();
    this.loadAllRoomTypes();
  }

  ngAfterViewInit() {
    // Map will be initialized when modal opens
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
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
    // Reset multi-select states
    this.amenitySearchQuery = '';
    this.roomTypeSearchQuery = '';
    this.daysOffSearchQuery = '';
    this.closeAmenityDropdown();
    this.closeRoomTypeDropdown();
    this.closeDaysOffDropdown();
    setTimeout(() => this.initMap(), 100);
  }

  openViewModal(hotel: HotelModel) {
    this.isEditMode = false;
    this.selectedHotel = {...hotel};
    this.modalTitle = 'Hotel Details';
    this.isModalOpen = true;
    // Reset multi-select states
    this.amenitySearchQuery = '';
    this.roomTypeSearchQuery = '';
    this.daysOffSearchQuery = '';
    this.closeAmenityDropdown();
    this.closeRoomTypeDropdown();
    this.closeDaysOffDropdown();
    setTimeout(() => this.initMap(), 100);
  }

  openEditModal(hotel: HotelModel) {
    this.isEditMode = true;
    this.selectedHotel = {...hotel};
    this.modalTitle = 'Edit Hotel';
    this.isModalOpen = true;
    // Reset multi-select states
    this.amenitySearchQuery = '';
    this.roomTypeSearchQuery = '';
    this.daysOffSearchQuery = '';
    this.closeAmenityDropdown();
    this.closeRoomTypeDropdown();
    this.closeDaysOffDropdown();
    setTimeout(() => this.initMap(), 100);
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedHotel = null;
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
    // Reset multi-select states
    this.closeAmenityDropdown();
    this.closeRoomTypeDropdown();
    this.closeDaysOffDropdown();
    this.amenitySearchQuery = '';
    this.roomTypeSearchQuery = '';
    this.daysOffSearchQuery = '';
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

  removeAmenity(amenity: AmenityModel) {
    if (!this.selectedHotel) return;
    const index = this.selectedHotel.amenities.findIndex(a => a.id === amenity.id);
    if (index >= 0) {
      this.selectedHotel.amenities.splice(index, 1);
    }
  }

  toggleAmenityDropdown() {
    this.isAmenityDropdownOpen = !this.isAmenityDropdownOpen;
  }

  closeAmenityDropdown() {
    this.isAmenityDropdownOpen = false;
  }

  getFilteredAmenities(): AmenityModel[] {
    if (!this.amenitySearchQuery) {
      return this.allAmenities;
    }
    const query = this.amenitySearchQuery.toLowerCase();
    return this.allAmenities.filter(amenity =>
      amenity.name.toLowerCase().includes(query) ||
      (amenity.code && amenity.code.toLowerCase().includes(query))
    );
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

  removeRoomType(roomType: RoomTypeModel) {
    if (!this.selectedHotel) return;
    const index = this.selectedHotel.roomTypes.findIndex(rt => rt.id === roomType.id);
    if (index >= 0) {
      this.selectedHotel.roomTypes.splice(index, 1);
    }
  }

  toggleRoomTypeDropdown() {
    this.isRoomTypeDropdownOpen = !this.isRoomTypeDropdownOpen;
  }

  closeRoomTypeDropdown() {
    this.isRoomTypeDropdownOpen = false;
  }

  getFilteredRoomTypes(): RoomTypeModel[] {
    if (!this.roomTypeSearchQuery) {
      return this.allRoomTypes;
    }
    const query = this.roomTypeSearchQuery.toLowerCase();
    return this.allRoomTypes.filter(roomType =>
      roomType.name.toLowerCase().includes(query)
    );
  }

  getDayOffDisplayName(dayOff: string): string {
    // Convert enum value to readable format (e.g., "MONDAY" -> "Monday")
    return dayOff.charAt(0) + dayOff.slice(1).toLowerCase();
  }

  toggleDayOff(dayOff: DayOffType) {
    if (!this.selectedHotel) return;
    if (!this.selectedHotel.daysOff) {
      this.selectedHotel.daysOff = [];
    }
    const dayOffValue = dayOff as string;
    const index = this.selectedHotel.daysOff.indexOf(dayOffValue);
    if (index >= 0) {
      this.selectedHotel.daysOff.splice(index, 1);
    } else {
      this.selectedHotel.daysOff.push(dayOffValue);
    }
  }

  isDayOffSelected(dayOff: DayOffType): boolean {
    if (!this.selectedHotel || !this.selectedHotel.daysOff) return false;
    return this.selectedHotel.daysOff.includes(dayOff as string);
  }

  removeDayOff(dayOff: string) {
    if (!this.selectedHotel || !this.selectedHotel.daysOff) return;
    const index = this.selectedHotel.daysOff.indexOf(dayOff);
    if (index >= 0) {
      this.selectedHotel.daysOff.splice(index, 1);
    }
  }

  toggleDaysOffDropdown() {
    this.isDaysOffDropdownOpen = !this.isDaysOffDropdownOpen;
  }

  closeDaysOffDropdown() {
    this.isDaysOffDropdownOpen = false;
  }

  getFilteredDaysOff(): DayOffType[] {
    if (!this.daysOffSearchQuery) {
      return this.availableDaysOff;
    }
    const query = this.daysOffSearchQuery.toLowerCase();
    return this.availableDaysOff.filter(dayOff =>
      dayOff.toLowerCase().includes(query) ||
      this.getDayOffDisplayName(dayOff).toLowerCase().includes(query)
    );
  }

  get DayOffType() {
    return DayOffType;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.amenityDropdown && !this.amenityDropdown.nativeElement.contains(event.target)) {
      this.closeAmenityDropdown();
    }
    if (this.roomTypeDropdown && !this.roomTypeDropdown.nativeElement.contains(event.target)) {
      this.closeRoomTypeDropdown();
    }
    if (this.daysOffDropdown && !this.daysOffDropdown.nativeElement.contains(event.target)) {
      this.closeDaysOffDropdown();
    }
  }

  getHotelTypeLabel(type: HotelType): string {
    return HotelType[type] || '';
  }

  get HotelType() {
    return HotelType;
  }

  initMap() {
    if (!this.mapContainer || !this.selectedHotel) return;

    // Remove existing map if any
    if (this.map) {
      this.map.remove();
    }

    // Fix Leaflet default icon paths - use CDN or default paths
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
    
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl,
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
    });

    // Determine center and zoom based on hotel coordinates
    const hasValidCoordinates = this.selectedHotel.latitude && this.selectedHotel.longitude && 
      this.selectedHotel.latitude !== 0 && this.selectedHotel.longitude !== 0;
    
    const defaultLat = hasValidCoordinates 
      ? this.selectedHotel.latitude 
      : 51.505;
    const defaultLng = hasValidCoordinates 
      ? this.selectedHotel.longitude 
      : -0.09;
    
    // Use appropriate zoom level: closer zoom for view mode with valid coordinates
    const defaultZoom = hasValidCoordinates 
      ? (this.isEditMode ? 13 : 15)  // Closer zoom in view mode to show location clearly
      : 2;

    // Initialize map
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
      zoomControl: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add marker if coordinates exist (always show marker in view mode if coordinates exist)
    if (hasValidCoordinates) {
      this.marker = L.marker([this.selectedHotel.latitude, this.selectedHotel.longitude])
        .addTo(this.map);
      
      // In view mode, ensure map is centered on marker
      if (!this.isEditMode) {
        this.map.setView([this.selectedHotel.latitude, this.selectedHotel.longitude], 15);
      }
    }

    // Add click handler only in edit mode
    if (this.isEditMode) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }
  }

  onMapClick(lat: number, lng: number) {
    if (!this.selectedHotel) return;

    // Update coordinates
    this.selectedHotel.latitude = lat;
    this.selectedHotel.longitude = lng;

    // Update or create marker
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map!);
    }

    // Center map on clicked location
    this.map!.setView([lat, lng], 13);

    // Reverse geocode to get address details
    this.reverseGeocode(lat, lng);
  }

  reverseGeocode(lat: number, lng: number) {
    if (!this.selectedHotel) return;

    this.isMapLoading = true;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

    this.http.get<any>(url, {
      headers: {
        'User-Agent': 'HotelAdmin/1.0'
      }
    }).subscribe({
      next: (data) => {
        this.isMapLoading = false;
        if (data && data.address) {
          const addr = data.address;

          // Fill address fields
          this.selectedHotel!.country = addr.country || '';
          this.selectedHotel!.state = addr.state || addr.region || addr.province || '';
          this.selectedHotel!.district = addr.city_district || addr.district || addr.suburb || '';
          this.selectedHotel!.house = addr.house_number || addr.house_name || '';
          this.selectedHotel!.postalCode = addr.postcode || '';
          
          // Build full address
          const addressParts: string[] = [];
          if (addr.road) addressParts.push(addr.road);
          if (addr.house_number) addressParts.push(addr.house_number);
          if (addr.city_district || addr.district) addressParts.push(addr.city_district || addr.district);
          if (addr.city || addr.town || addr.village) addressParts.push(addr.city || addr.town || addr.village);
          
          this.selectedHotel!.address = addressParts.length > 0 
            ? addressParts.join(', ') 
            : data.display_name || '';
        } else {
          // Fallback to display_name if address structure is different
          this.selectedHotel!.address = data.display_name || '';
        }
      },
      error: (err) => {
        this.isMapLoading = false;
        console.error('Error reverse geocoding:', err);
        // Still update coordinates even if geocoding fails
      }
    });
  }
}

