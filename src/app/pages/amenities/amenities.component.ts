import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AmenityService} from '../../services/amenity.service';
import {AmenityModel} from '../../services/model/amenity.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './amenities.component.html',
  styleUrl: './amenities.component.css'
})
export class AmenitiesComponent implements OnInit {

  amenities: AmenityModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedAmenity: AmenityModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  amenityToDelete: AmenityModel | null = null;

  // Filter values
  searchQuery: string = '';
  filterCode: string = '';
  filters: FilterModel[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc'

  constructor(private amenityService: AmenityService) {
  }

  ngOnInit() {
    this.loadAmenities();
  }

  loadAmenities() {
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
    if (this.filterCode != '') {
      filterEmpty = false;
      this.removeFilter("code.contains");
      this.filters.push(new FilterModel("code.contains", FieldType.TEXT, this.filterCode));
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
    this.amenityService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.amenities = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get amenities list:', err);
        alert('Failed to get amenities list. Please try again.');
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
    this.selectedAmenity = {
      id: 0,
      name: '',
      code: '',
      description: ''
    };
    this.modalTitle = 'Add Amenity';
    this.isModalOpen = true;
  }

  openViewModal(amenity: AmenityModel) {
    this.isEditMode = false;
    this.selectedAmenity = {...amenity};
    this.modalTitle = 'Amenity Details';
    this.isModalOpen = true;
  }

  openEditModal(amenity: AmenityModel) {
    this.isEditMode = true;
    this.selectedAmenity = {...amenity};
    this.modalTitle = 'Edit Amenity';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedAmenity = null;
  }

  saveAmenity() {
    if (this.selectedAmenity) {
      // Validate required fields
      if (!this.selectedAmenity.name || !this.selectedAmenity.code) {
        alert('Please fill in all required fields (Name, Code)');
        return;
      }

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedAmenity.id || this.selectedAmenity.id === 0;
      if (isAddOperation) {
        this.selectedAmenity.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.amenityService.create(this.selectedAmenity)
        : this.amenityService.update(this.selectedAmenity);

      saveOperation.subscribe({
        next: () => {
          // Reload amenities to reflect changes
          this.loadAmenities();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving amenity:', err);
          alert('Failed to save amenity. Please try again.');
        }
      });
    }
  }

  openDeleteModal(amenity: AmenityModel) {
    this.amenityToDelete = amenity;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.amenityToDelete = null;
  }

  confirmDelete() {
    if (this.amenityToDelete && this.amenityToDelete.id) {
      this.amenityService.delete(this.amenityToDelete.id).subscribe({
        next: () => {
          // Reload amenities to reflect changes
          this.loadAmenities();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting amenity:', err);
          alert('Failed to delete amenity. Please try again.');
        }
      });
    }
  }
}

