import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DropdownLink } from '@shared/interfaces/DropdownLink';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'shared-navbar',
  standalone: true,
  imports: [
    CommonModule,
    DropdownComponent,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  menuIsOpen: WritableSignal<boolean> = signal(false);

  dropdownLinksCategories: DropdownLink[] = [
    {
      label: 'All',
      route: ['/products']
    },
    {
      label: 'Electronics',
      route: ['/products', 'electronics']
    },
    {
      label: 'Furniture',
      route: ['/products', 'furniture']
    },
    {
      label: 'Clothing',
      route: ['/products', 'clothing']
    },
  ];

  toggleMenu(): void {
    this.menuIsOpen.set(!this.menuIsOpen());
  }
}
