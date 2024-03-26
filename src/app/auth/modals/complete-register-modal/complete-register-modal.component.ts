import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input, signal } from '@angular/core';
import { AuctionTypes } from '@auctions/enums/auction-types';

import { CompleteRegisterComponent } from '@auth/pages/complete-register/complete-register.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'complete-register-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CompleteRegisterComponent
  ],
  templateUrl: './complete-register-modal.component.html',
  styleUrl: './complete-register-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegisterModalComponent {
  @Input() isOpen = signal<boolean>(false);
  publicationId = input.required<string>();
  auctionType = input.required<AuctionTypes>();

  @Output() getHasGeneralInfo: EventEmitter<void> = new EventEmitter<void>();

  completeRegisterModalIsOpenChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);
    this.getHasGeneralInfo.emit();
  }

  isOpenChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);
  }
}
