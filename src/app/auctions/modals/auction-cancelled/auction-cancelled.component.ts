import { ChangeDetectionStrategy, Component, EventEmitter, Output, input, model } from '@angular/core';
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
  isOpen = model.required<boolean>();
  auctionId = input.required<string>();
}
