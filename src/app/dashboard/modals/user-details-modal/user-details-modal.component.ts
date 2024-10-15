import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { UsersData } from '@dashboard/interfaces';
import { Fancybox } from '@fancyapps/ui';

import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'user-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
  ],
  templateUrl: './user-details-modal.component.html',
  styleUrl: './user-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModalComponent {
  isOpen = model.required<boolean>();

  user = input.required<UsersData>();

  closeModal(): void {
    this.isOpen.set(false);
  }

  constructor() {
    Fancybox.bind("[data-fancybox='photoGallery']", { Hash: false });
  }
}
