import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUsersService } from '../../../core/services/admin/admin-users.service';
@Component({
  selector: 'app-admin-users',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  filterRole: string = '';
  filterEmail: string = '';
  selectedUser: User | null = null;

  constructor(private userAdminService: AdminUsersService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userAdminService
      .getAllUsers(this.searchTerm, this.filterEmail, this.filterRole)
      .subscribe({
        next: (res) => {
          this.users = res;
          this.filteredUsers = res;
        },
        error: (err) => console.error(err),
      });
  }

  filterUsers(): void {
    let filtered = this.users;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((user) =>
        user.userName.toLowerCase().includes(term)
      );
    }
    if (this.filterEmail) {
      const emailTerm = this.filterEmail.toLowerCase();
      filtered = filtered.filter((user) =>
        (user.email ?? '').toLowerCase().includes(emailTerm)
      );
    }
    if (this.filterRole) {
      filtered = filtered.filter((user) =>
        user.roles.some(
          (r) => r.toLowerCase() === this.filterRole.toLowerCase()
        )
      );
    }
    this.filteredUsers = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterEmail = '';
    this.filterRole = '';
    this.filteredUsers = this.users;
  }

  showDetails(user: User) {
    this.selectedUser = user;
  }

  closeDetails() {
    this.selectedUser = null;
  }

  makeAdmin(userName: string) {
    if (!confirm('Are you sure you want to promote this user to Admin?'))
      return;
    this.userAdminService
      .makeAdmin(userName)
      .subscribe(() => this.fetchUsers());
  }

  removeAdmin(userName: string) {
    if (!confirm('Are you sure you want to remove Admin role from this user?'))
      return;
    this.userAdminService
      .removeAdmin(userName)
      .subscribe(() => this.fetchUsers());
  }

  removeServiceProvider(userName: string) {
    if (
      !confirm(
        'Are you sure you want to make this Service Provider a normal user?'
      )
    )
      return;
    this.userAdminService
      .removeServiceProvider(userName)
      .subscribe(() => this.fetchUsers());
  }

  deleteUser(id: string) {
    if (
      !confirm(
        'Are you sure you want to delete this user? This cannot be undone.'
      )
    )
      return;
    this.userAdminService.deleteUser(id).subscribe(() => this.fetchUsers());
  }
}
