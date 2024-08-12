import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { ApprovedBids } from '@activity/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'sold-auction-bid-table-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './sold-auction-bid-table-modal.component.html',
  styleUrl: './sold-auction-bid-table-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoldAuctionBidTableModalComponent {
  isOpen = model.required<boolean>();

  bids = input.required<ApprovedBids[]>();
}
