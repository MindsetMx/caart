import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownLink } from '@shared/interfaces/DropdownLink';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  @Input({ required: true }) buttonText?: string;
  @Input({ required: true }) dropdownLinks?: DropdownLink[];
  isOpen: boolean = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
}
