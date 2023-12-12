import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputDirective } from '@shared/directives/input.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    PrimaryButtonDirective,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  dropdownIsOpen: WritableSignal<boolean> = signal(true);

  toggleDropdown(): void {
    this.dropdownIsOpen.set(!this.dropdownIsOpen());
  }
}
