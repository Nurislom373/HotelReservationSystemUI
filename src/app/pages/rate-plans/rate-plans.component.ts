import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RatePlanService} from '../../services/rate-plan.service';
import {RatePlanModel, RatePlanStatus, RatePlanType} from '../../services/model/rate/rate.plan.model';
import {ExtraServiceService} from '../../services/extra-service.service';
import {ExtraServiceModel} from '../../services/model/extra.service.model';
import {CancellationPolicyModel, CancellationPolicyType, CancellationPolicyChargeType} from '../../services/model/cancellation.policy.model';
import {CurrencyModel} from '../../services/model/currency.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-rate-plans',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './rate-plans.component.html',
  styleUrl: './rate-plans.component.css'
})
export class RatePlansComponent implements OnInit {

  ratePlans: RatePlanModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedRatePlan: RatePlanModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  ratePlanToDelete: RatePlanModel | null = null;

  // Available options
  allExtraServices: ExtraServiceModel[] = [];
  allCurrencies: CurrencyModel[] = [];

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

  // Status and Type enums
  ratePlanStatuses = Object.values(RatePlanStatus);
  ratePlanTypes = Object.values(RatePlanType);

  // Multi-select for extra services
  isExtraServicesDropdownOpen: boolean = false;
  extraServicesSearchQuery: string = '';
  selectedExtraServices: ExtraServiceModel[] = [];

  // Cancellation policy sub-modals
  isCancellationPolicyModalOpen: boolean = false;
  cancellationPolicyType: 'early' | 'late' | null = null;
  isCancellationPolicyViewMode: boolean = false;
  cancellationPolicyForm: CancellationPolicyModel = {
    name: '',
    type: CancellationPolicyType.EARLY,
    chargeType: CancellationPolicyChargeType.FREE_OF_CHARGE,
    rate: 0
  };
  cancellationPolicyChargeTypes = Object.values(CancellationPolicyChargeType);

  @ViewChild('statusDropdown', { static: false }) statusDropdown?: ElementRef;
  @ViewChild('extraServicesDropdown', { static: false }) extraServicesDropdown?: ElementRef;

  constructor(
    private ratePlanService: RatePlanService,
    private extraServiceService: ExtraServiceService
  ) {
  }

  ngOnInit() {
    this.loadRatePlans();
    this.loadAllExtraServices();
    this.loadAllCurrencies();
  }

  loadRatePlans() {
    this.updatePaginatedData();
  }

  loadAllExtraServices() {
    this.extraServiceService.getAll('').subscribe({
      next: httpResponse => {
        this.allExtraServices = httpResponse.body || [];
      },
      error: err => {
        console.error('Error loading extra services:', err);
      }
    });
  }

  loadAllCurrencies() {
    // Mock currencies for now - replace with actual service if available
    this.allCurrencies = [
      { id: 1, name: 'US Dollar', shortName: 'USD' },
      { id: 2, name: 'Euro', shortName: 'EUR' },
      { id: 3, name: 'Uzbekistani Som', shortName: 'UZS' }
    ];
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    this.filters = [];
    if (this.searchQuery != '') {
      this.filters.push(new FilterModel("name.contains", FieldType.TEXT, this.searchQuery));
    }
    if (this.filterStatus != '') {
      this.filters.push(new FilterModel("status.equals", FieldType.TEXT, this.filterStatus));
    }
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    this.ratePlanService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.ratePlans = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get rate plans list:', err);
        alert('Failed to get rate plans list. Please try again.');
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
    this.selectedRatePlan = {
      id: 0,
      name: '',
      shortName: '',
      status: RatePlanStatus.ACTIVE,
      type: RatePlanType.BASE,
      startDate: new Date(),
      endDate: null,
      extraServices: [],
      currency: this.allCurrencies[0] || undefined
    };
    this.selectedExtraServices = [];
    this.modalTitle = 'Add Rate Plan';
    this.isModalOpen = true;
  }

  openViewModal(ratePlan: RatePlanModel) {
    this.isEditMode = false;
    this.selectedRatePlan = {...ratePlan};
    this.selectedExtraServices = ratePlan.extraServices ? [...ratePlan.extraServices] : [];
    this.modalTitle = 'Rate Plan Details';
    this.isModalOpen = true;
  }

  openEditModal(ratePlan: RatePlanModel) {
    this.isEditMode = true;
    this.selectedRatePlan = {...ratePlan};
    this.selectedExtraServices = ratePlan.extraServices ? [...ratePlan.extraServices] : [];
    this.modalTitle = 'Edit Rate Plan';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRatePlan = null;
    this.selectedExtraServices = [];
    this.isExtraServicesDropdownOpen = false;
    this.extraServicesSearchQuery = '';
  }

  saveRatePlan() {
    if (this.selectedRatePlan) {
      // Validate required fields
      if (!this.selectedRatePlan.name || !this.selectedRatePlan.shortName || !this.selectedRatePlan.startDate) {
        alert('Please fill in all required fields (Name, Short Name, Start Date)');
        return;
      }

      // Update extra services
      this.selectedRatePlan.extraServices = [...this.selectedExtraServices];

      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedRatePlan.id || this.selectedRatePlan.id === 0;
      if (isAddOperation) {
        this.selectedRatePlan.id = undefined;
      }

      const saveOperation = isAddOperation
        ? this.ratePlanService.create(this.selectedRatePlan)
        : this.ratePlanService.update(this.selectedRatePlan);

      saveOperation.subscribe({
        next: () => {
          this.loadRatePlans();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving rate plan:', err);
          alert('Failed to save rate plan. Please try again.');
        }
      });
    }
  }

  openDeleteModal(ratePlan: RatePlanModel) {
    this.ratePlanToDelete = ratePlan;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.ratePlanToDelete = null;
  }

  confirmDelete() {
    if (this.ratePlanToDelete && this.ratePlanToDelete.id) {
      this.ratePlanService.delete(this.ratePlanToDelete.id).subscribe({
        next: () => {
          this.loadRatePlans();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting rate plan:', err);
          alert('Failed to delete rate plan. Please try again.');
        }
      });
    }
  }

  // Status dropdown methods
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
    return this.filterStatus;
  }

  getStatusLabel(status: RatePlanStatus): string {
    return status.replace(/_/g, ' ');
  }

  getTypeLabel(type: RatePlanType): string {
    return type;
  }

  formatDate(date: Date | string | undefined | null): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getDateString(date: Date | string | undefined | null): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onStartDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value && this.selectedRatePlan) {
      this.selectedRatePlan.startDate = new Date(target.value);
    }
  }

  onEndDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value && this.selectedRatePlan) {
      this.selectedRatePlan.endDate = new Date(target.value);
    } else if (this.selectedRatePlan) {
      this.selectedRatePlan.endDate = null;
    }
  }

  // Extra Services multi-select methods
  toggleExtraServicesDropdown() {
    this.isExtraServicesDropdownOpen = !this.isExtraServicesDropdownOpen;
  }

  closeExtraServicesDropdown() {
    this.isExtraServicesDropdownOpen = false;
    this.extraServicesSearchQuery = '';
  }

  getFilteredExtraServices(): ExtraServiceModel[] {
    if (!this.extraServicesSearchQuery) {
      return this.allExtraServices;
    }
    const query = this.extraServicesSearchQuery.toLowerCase();
    return this.allExtraServices.filter(service =>
      service.name.toLowerCase().includes(query) ||
      (service.description && service.description.toLowerCase().includes(query))
    );
  }

  isExtraServiceSelected(service: ExtraServiceModel): boolean {
    return this.selectedExtraServices.some(s => s.id === service.id);
  }

  toggleExtraService(service: ExtraServiceModel) {
    const index = this.selectedExtraServices.findIndex(s => s.id === service.id);
    if (index >= 0) {
      this.selectedExtraServices.splice(index, 1);
    } else {
      this.selectedExtraServices.push(service);
    }
  }

  getSelectedExtraServicesLabel(): string {
    if (this.selectedExtraServices.length === 0) {
      return 'Select extra services';
    }
    if (this.selectedExtraServices.length === 1) {
      return this.selectedExtraServices[0].name;
    }
    return `${this.selectedExtraServices.length} services selected`;
  }

  // Cancellation Policy sub-modal methods
  openCancellationPolicyModal(type: 'early' | 'late', viewMode: boolean = false) {
    this.cancellationPolicyType = type;
    this.isCancellationPolicyViewMode = viewMode;
    const existingPolicy = type === 'early'
      ? this.selectedRatePlan?.earlyCancellationPolicy
      : this.selectedRatePlan?.lateCancellationPolicy;

    if (existingPolicy) {
      this.cancellationPolicyForm = {...existingPolicy};
    } else {
      this.cancellationPolicyForm = {
        name: '',
        type: type === 'early' ? CancellationPolicyType.EARLY : CancellationPolicyType.LATE,
        chargeType: CancellationPolicyChargeType.FREE_OF_CHARGE,
        rate: 0
      };
    }
    this.isCancellationPolicyModalOpen = true;
  }

  closeCancellationPolicyModal() {
    this.isCancellationPolicyModalOpen = false;
    this.cancellationPolicyType = null;
    this.isCancellationPolicyViewMode = false;
    this.cancellationPolicyForm = {
      name: '',
      type: CancellationPolicyType.EARLY,
      chargeType: CancellationPolicyChargeType.FREE_OF_CHARGE,
      rate: 0
    };
  }

  saveCancellationPolicy() {
    if (!this.cancellationPolicyForm.name) {
      alert('Please enter a policy name');
      return;
    }

    if (this.selectedRatePlan && this.cancellationPolicyType) {
      if (this.cancellationPolicyType === 'early') {
        this.selectedRatePlan.earlyCancellationPolicy = {...this.cancellationPolicyForm};
      } else {
        this.selectedRatePlan.lateCancellationPolicy = {...this.cancellationPolicyForm};
      }
    }

    this.closeCancellationPolicyModal();
  }

  getCancellationPolicyLabel(policy: CancellationPolicyModel | undefined): string {
    if (!policy) return 'Not set';
    return policy.name || 'Unnamed Policy';
  }

  getChargeTypeLabel(chargeType: CancellationPolicyChargeType): string {
    return chargeType.replace(/_/g, ' ');
  }

  compareCurrencies(currency1: CurrencyModel | null | undefined, currency2: CurrencyModel | null | undefined): boolean {
    return currency1?.id === currency2?.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isStatusDropdownOpen && this.statusDropdown) {
      const clickedInside = this.statusDropdown.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeStatusDropdown();
      }
    }
    if (this.isExtraServicesDropdownOpen && this.extraServicesDropdown) {
      const clickedInside = this.extraServicesDropdown.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeExtraServicesDropdown();
      }
    }
  }
}

