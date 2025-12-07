import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../services/model/user.model';
import {TenantService} from '../../services/tenant.service';
import {TenantModel} from '../../services/model/tenant.model';
import {RoleService} from '../../services/role.service';
import {RoleModel} from '../../services/model/role.model';
import {ChangePasswordModel} from '../../services/model/change.password.model';
import {ModalComponent} from '../../components/modal/modal.component';
import {FormsModule} from '@angular/forms';
import {IconComponent} from '../../components/icons/icons.component';
import {FilterModel} from '../../services/base/models/filter/filter.model';
import {FieldType} from '../../services/base/models/filter/field.type';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, IconComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: UserModel[] = [];
  isModalOpen = false;
  modalTitle = '';
  selectedUser: UserModel | null = null;
  isEditMode = false;
  isDeleteModalOpen = false;
  userToDelete: UserModel | null = null;
  isAssignRoleModalOpen = false;
  userForRoleAssignment: UserModel | null = null;
  isResetPasswordModalOpen = false;
  userForPasswordReset: UserModel | null = null;
  changePasswordModel: ChangePasswordModel = { login: '', password: '' };

  // Available tenants for dropdown
  allTenants: TenantModel[] = [];

  // Available roles for assignment
  allRoles: RoleModel[] = [];
  selectedRoles: RoleModel[] = [];
  roleSearchQuery: string = '';
  isRoleDropdownOpen: boolean = false;

  // Filter values
  searchQuery: string = '';
  filterEmail: string = '';
  filterPhoneNumber: string = '';
  filterLogin: string = '';
  filterActivated: string = '';
  isStatusDropdownOpen: boolean = false;
  filters: FilterModel[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  // Sorting
  sort: string = 'id,desc'

  @ViewChild('statusDropdown', {static: false}) statusDropdown?: ElementRef;
  @ViewChild('roleDropdown', {static: false}) roleDropdown?: ElementRef;

  constructor(
    private userService: UserService,
    private tenantService: TenantService,
    private roleService: RoleService
  ) {
  }

  ngOnInit() {
    this.loadUsers();
    this.loadAllTenants();
    this.loadAllRoles();
  }

  loadUsers() {
    this.updatePaginatedData();
  }

  loadAllTenants() {
    this.tenantService.getAll('').subscribe({
      next: httpResponse => {
        this.allTenants = httpResponse.body || [];
      },
      error: err => {
        console.error('Error loading tenants:', err);
      }
    });
  }

  loadAllRoles() {
    this.roleService.getAll('').subscribe({
      next: httpResponse => {
        this.allRoles = (httpResponse.body || []).filter(role => !role.isDeleted);
      },
      error: err => {
        console.error('Error loading roles:', err);
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
      this.removeFilter("firstName.contains");
      this.filters.push(new FilterModel("firstName.contains", FieldType.TEXT, this.searchQuery));
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
    if (this.filterLogin != '') {
      filterEmpty = false;
      this.removeFilter("login.contains");
      this.filters.push(new FilterModel("login.contains", FieldType.TEXT, this.filterLogin));
    }
    if (this.filterActivated != '') {
      filterEmpty = false;
      this.removeFilter("activated.equals");
      this.filters.push(new FilterModel("activated.equals", FieldType.TEXT, this.filterActivated));
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
    this.userService.getByQueryPagination({
      size: this.itemsPerPage,
      page: this.currentPage,
      sort: this.sort,
      filterModels: this.filters
    }).subscribe({
      next: httpResponse => {
        this.users = httpResponse.body!;
        let totalCount = httpResponse.headers.get("X-Total-Count");
        const totalCountNumber = totalCount as unknown as number;
        if (totalCount != null) {
          this.totalPages = Math.ceil(totalCountNumber / this.itemsPerPage);
        }
      },
      error: err => {
        console.error('Error get users list:', err);
        alert('Failed to get users list. Please try again.');
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
    this.selectedUser = {
      id: 0,
      login: '',
      password: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      activated: true,
      langKey: 'en',
      imageUrl: '',
      tenant: this.allTenants[0] || {} as TenantModel
    };
    this.modalTitle = 'Add User';
    this.isModalOpen = true;
  }

  openViewModal(user: UserModel) {
    this.isEditMode = false;
    this.selectedUser = {...user};
    this.modalTitle = 'User Details';
    this.isModalOpen = true;
  }

  openEditModal(user: UserModel) {
    this.isEditMode = true;
    this.selectedUser = {...user};
    this.modalTitle = 'Edit User';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  saveUser() {
    if (this.selectedUser) {
      // Determine if this is an add or edit operation
      const isAddOperation = !this.selectedUser.id || this.selectedUser.id === 0;

      // Validate required fields
      if (!this.selectedUser.login || !this.selectedUser.firstName || !this.selectedUser.lastName || !this.selectedUser.email) {
        alert('Please fill in all required fields (Login, First Name, Last Name, Email)');
        return;
      }

      // Validate password for add operation
      if (isAddOperation && (!this.selectedUser.password || this.selectedUser.password.trim() === '')) {
        alert('Please enter a password');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.selectedUser.email && !emailRegex.test(this.selectedUser.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // For edit operations, remove password field if it's empty or not provided
      const userToSave = {...this.selectedUser};
      if (!isAddOperation) {
        delete userToSave.password;
      }

      const saveOperation = isAddOperation
        ? this.userService.create(userToSave)
        : this.userService.update(userToSave);

      saveOperation.subscribe({
        next: () => {
          // Reload users to reflect changes
          this.loadUsers();
          // Close modal after successful save
          this.closeModal();
        },
        error: (err) => {
          console.error('Error saving user:', err);
          alert('Failed to save user. Please try again.');
        }
      });
    }
  }

  openDeleteModal(user: UserModel) {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  confirmDelete() {
    if (this.userToDelete && this.userToDelete.id) {
      this.userService.delete(this.userToDelete.id).subscribe({
        next: () => {
          // Reload users to reflect changes
          this.loadUsers();
          // Close modal after successful delete
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Please try again.');
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
    this.filterActivated = value;
    this.onFilterChange();
    this.closeStatusDropdown();
  }

  getStatusLabel(): string {
    if (this.filterActivated === 'true') return 'Activated';
    if (this.filterActivated === 'false') return 'Not Activated';
    return 'All Status';
  }

  compareTenants(tenant1: TenantModel | null, tenant2: TenantModel | null): boolean {
    return tenant1?.id === tenant2?.id;
  }

  openAssignRoleModal(user: UserModel) {
    this.userForRoleAssignment = {...user};
    // Pre-select roles that exist in user's authorities array
    this.selectedRoles = this.allRoles.filter(role =>
      user.authorities?.includes(role.name)
    );
    this.roleSearchQuery = '';
    this.isRoleDropdownOpen = false;
    this.isAssignRoleModalOpen = true;
  }

  closeAssignRoleModal() {
    this.isAssignRoleModalOpen = false;
    this.userForRoleAssignment = null;
    this.selectedRoles = [];
    this.roleSearchQuery = '';
    this.isRoleDropdownOpen = false;
  }

  toggleRole(role: RoleModel) {
    const index = this.selectedRoles.findIndex(r => r.id === role.id);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
  }

  isRoleSelected(role: RoleModel): boolean {
    return this.selectedRoles.some(r => r.id === role.id);
  }

  saveRoleAssignment() {
    if (this.userForRoleAssignment) {
      // Update user's authorities array with selected role names
      this.userForRoleAssignment.authorities = this.selectedRoles.map(role => role.name);

      // Update the user via API
      this.userService.update(this.userForRoleAssignment).subscribe({
        next: () => {
          // Reload users to reflect changes
          this.loadUsers();
          // Close modal after successful save
          this.closeAssignRoleModal();
        },
        error: (err) => {
          console.error('Error assigning roles:', err);
          alert('Failed to assign roles. Please try again.');
        }
      });
    }
  }

  getFilteredRoles(): RoleModel[] {
    if (!this.roleSearchQuery) {
      return this.allRoles;
    }
    const query = this.roleSearchQuery.toLowerCase();
    return this.allRoles.filter(role =>
      role.name.toLowerCase().includes(query)
    );
  }

  toggleRoleDropdown() {
    this.isRoleDropdownOpen = !this.isRoleDropdownOpen;
  }

  closeRoleDropdown() {
    this.isRoleDropdownOpen = false;
  }

  removeRole(role: RoleModel) {
    const index = this.selectedRoles.findIndex(r => r.id === role.id);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
    }
  }

  openResetPasswordModal(user: UserModel) {
    this.userForPasswordReset = user;
    this.changePasswordModel = {
      login: user.login,
      password: ''
    };
    this.isResetPasswordModalOpen = true;
  }

  closeResetPasswordModal() {
    this.isResetPasswordModalOpen = false;
    this.userForPasswordReset = null;
    this.changePasswordModel = { login: '', password: '' };
  }

  savePasswordReset() {
    if (!this.changePasswordModel.password || this.changePasswordModel.password.trim() === '') {
      alert('Please enter a new password');
      return;
    }

    if (this.changePasswordModel.password.length < 4) {
      alert('Password must be at least 4 characters long');
      return;
    }

    this.userService.changePassword(this.changePasswordModel).subscribe({
      next: () => {
        alert('Password has been reset successfully');
        this.closeResetPasswordModal();
      },
      error: (err) => {
        console.error('Error resetting password:', err);
        alert('Failed to reset password. Please try again.');
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isStatusDropdownOpen && this.statusDropdown) {
      const clickedInside = this.statusDropdown.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeStatusDropdown();
      }
    }
    if (this.isRoleDropdownOpen && this.roleDropdown) {
      const clickedInside = this.roleDropdown.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.closeRoleDropdown();
      }
    }
  }
}

