import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives';

@Component({
  selector: 'auction-cancelled',
  standalone: true,
  imports: [
    ModalComponent,
    PrimaryButtonDirective,
    RouterLink
  ],
  templateUrl: './auction-cancelled.component.html',
  styleUrl: './auction-cancelled.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCancelledComponent {
  isOpen = input.required<boolean>();
  auctionId = input.required<string>();
  @Output() isOpenChange = new EventEmitter<boolean>();
}
