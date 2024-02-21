import { ChangeDetectionStrategy, Component, Input, OnInit, WritableSignal, inject, input, signal } from '@angular/core';

import { InputDirective } from '@shared/directives/input.directive';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { BiddingConditionsService } from '../../services/bidding-conditions.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'auction-make-an-offer-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InputDirective,
    PrimaryButtonDirective,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './make-an-offer-modal.component.html',
  styleUrl: './make-an-offer-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeAnOfferModalComponent implements OnInit {
  @Input() isOpen: WritableSignal<boolean> = signal(false);
  auctionId = input.required<string>();
  minimumNextBid = signal<number>(0);
  disableBidButton = signal<boolean>(false);
  holdAmount = signal<number>(0);
  #formBuilder = inject(FormBuilder);

  offerAmount: FormControl = new FormControl<number>(0);

  #biddingConditionsService = inject(BiddingConditionsService);

  ngOnInit(): void {
    this.getBiddingConditions();
  }

  setOfferAmount(value: number): void {
    this.offerAmount.setValue(value);
    this.getBidConditions(value);
  }

  getBiddingConditions(): void {
    this.#biddingConditionsService.getBiddingConditions(this.auctionId()).subscribe({
      next: (biddingConditions) => {
        console.log({ biddingConditions });
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);
        this.getBidConditions(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBidConditions(userBidAmount: number): void {
    this.#biddingConditionsService.getBidConditions(this.auctionId(), userBidAmount).subscribe({
      next: (bidConditions) => {
        console.log({ bidConditions });
        this.disableBidButton.set(bidConditions.data.disableBidButton);
        this.holdAmount.set(bidConditions.data.holdAmount);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
