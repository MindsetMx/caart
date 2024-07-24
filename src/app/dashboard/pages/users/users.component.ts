import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { Users, UsersData } from '@dashboard/interfaces';
import { UsersService } from '@dashboard/services/users.service';
import { UserDetailsModalComponent } from '@dashboard/modals/user-details-modal/user-details-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    UserDetailsModalComponent,
    MatPaginatorModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  #usersService = inject(UsersService);
  #router = inject(Router);

  users = signal<Users>({} as Users);
  selectedUser = signal<UsersData>({} as UsersData);
  isUserDetailsModalOpen = signal<boolean>(false);
  page = signal<number>(1);
  size = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);

  getMyUsersEffect = effect(() => {
    this.getUsers();
  });

  getUsers(): void {
    this.#usersService.getUsers$(this.page(), this.size()).subscribe((users) => {
      this.users.set(users);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(users.meta.total));
    });
  }

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.users().meta.pageSize; i <= totalItems; i += this.users().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }

  onPageChange(event: any): void {
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);

    this.#router.navigate([], {
      queryParams: {
        page: this.page(),
        size: this.size()
      },
      queryParamsHandling: 'merge',
    });
  }

  openUserDetailsModal(user: UsersData): void {
    this.selectedUser.set(user);
    this.isUserDetailsModalOpen.set(true);
  }
}
