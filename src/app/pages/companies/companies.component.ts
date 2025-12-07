import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompanyService} from '../../services/company.service';
import {CompanyModel} from '../../services/model/company.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {

  companies: CompanyModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedCompany: CompanyModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  companyToDelete: CompanyModel | null = null;

  // Filter values
  searchQuery: string = '';
  filterInn: string = '';
  filterRegistrationNumber: string = '';
  filterEmail: string = '';
  filterPhoneNumber: string = '';
  filterAddress: string = '';
  filterIsActive: string = ''; // Empty string means "all", "true" means active, "false" means inactive
  isStatusDropdownOpen: boolean = false;
  filters: FilterModel[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc'

  @ViewChild('statusDropdown', {static: false}) statusDropdown?: ElementRef;

  constructor(private companyService: CompanyService) {
  }

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
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
    if (this.filterInn != '') {
      filterEmpty = false;
      this.removeFilter("inn.contains");
      this.filters.push(new FilterModel("inn.contains", FieldType.TEXT, this.filterInn));
    }
    if (this.filterRegistrationNumber != '') {
      filterEmpty = false;
      this.removeFilter("registrationNumber.contains");
      this.filters.push(new FilterModel("registrationNumber.contains", FieldType.TEXT, this.filterRegistrationNumber));
    }
    if (this.filterEmail != '') {
      filterEmpty = false;
      this.removeFilter("email.contains");
      this.filters.push(new FilterModel("email.contains", FieldType.TEXT, this.filterEmail));
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
    if (this.filterIsActive != '') {
      filterEmpty = false;
      this.removeFilter("isActive.equals");
      this.filters.push(new FilterModel("isActive.equals", FieldType.TEXT, this.filterIsActive));
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
    this.companyService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.companies = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get companies list:', err);
        alert('Failed to get companies list. Please try again.');
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
    this.selectedCompany = {
      id: undefined,
      inn: 0,
      name: '',
      registrationNumber: '',
      email: '',
      phoneNumber: '',
      address: '',
      isActive: true
    };
    this.modalTitle = 'Add Company';
    this.isModalOpen = true;
  }

  openViewModal(company: CompanyModel) {
    this.isEditMode = false;
    this.selectedCompany = {...company};
    this.modalTitle = 'Company Details';
    this.isModalOpen = true;
  }

  openEditModal(company: CompanyModel) {
    this.isEditMode = true;
    this.selectedCompany = {...company};
    this.modalTitle = 'Edit Company';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCompany = null;
  }

  saveCompany() {
    if (this.selectedCompany) {
      // Validate required fields
      if (!this.selectedCompany.name || !this.selectedCompany.inn || !this.selectedCompany.registrationNumber) {
        alert('Please fill in all required fields (Name, INN, Registration Number)');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.selectedCompany.email && !emailRegex.test(this.selectedCompany.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedCompany.id || this.selectedCompany.id === 0;
      if (isAddOperation) {
        this.selectedCompany.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.companyService.create(this.selectedCompany)
        : this.companyService.update(this.selectedCompany);

      saveOperation.subscribe({
        next: () => {
          // Reload companies to reflect changes
          this.loadCompanies();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving company:', err);
          alert('Failed to save company. Please try again.');
        }
      });
    }
  }

  openDeleteModal(company: CompanyModel) {
    this.companyToDelete = company;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.companyToDelete = null;
  }

  confirmDelete() {
    if (this.companyToDelete && this.companyToDelete.id) {
      this.companyService.delete(this.companyToDelete.id).subscribe({
        next: () => {
          // Reload companies to reflect changes
          this.loadCompanies();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting company:', err);
          alert('Failed to delete company. Please try again.');
        }
      });
    }
  }

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  closeStatusDropdown() {
    this.isStatusDropdownOpen = false;
  }

  selectStatus(value: string) {
    this.filterIsActive = value;
    this.onFilterChange();
    this.closeStatusDropdown();
  }

  getStatusLabel(): string {
    if (this.filterIsActive === 'true') return 'Active';
    if (this.filterIsActive === 'false') return 'Inactive';
    return 'All Status';
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

