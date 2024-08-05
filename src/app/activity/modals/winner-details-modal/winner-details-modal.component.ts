import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { WinnerInfo } from '@activity/interfaces';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'winner-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './winner-details-modal.component.html',
  styleUrl: './winner-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerDetailsModalComponent {
  isOpen = model.required<boolean>();

  winnerInfo = input.required<WinnerInfo>();
}
