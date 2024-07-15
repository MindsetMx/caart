import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { Users, UsersData } from '@dashboard/interfaces';
import { UsersService } from '@dashboard/services/users.service';
import { UserDetailsModalComponent } from '@dashboard/modals/user-details-modal/user-details-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    UserDetailsModalComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  #usersService = inject(UsersService);

  users = signal<Users>({} as Users);
  selectedUser = signal<UsersData>({} as UsersData);
  isUserDetailsModalOpen = signal<boolean>(false);
  page = signal<number>(1);
  size = signal<number>(10);

  constructor() {
    this.getUsers();
  }

  getUsers(): void {
    this.#usersService.getUsers$(this.page(), this.size()).subscribe((users) => {
      this.users.set(users);
    });
  }

  openUserDetailsModal(user: UsersData): void {
    this.selectedUser.set(user);
    this.isUserDetailsModalOpen.set(true);
  }
}
