import { ChangeDetectionStrategy, Component, Input, WritableSignal, signal } from '@angular/core';

import { InputDirective } from '@shared/directives/input.directive';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';

@Component({
  selector: 'auction-make-an-offer-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InputDirective,
    PrimaryButtonDirective
  ],
  templateUrl: './make-an-offer-modal.component.html',
  styleUrl: './make-an-offer-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeAnOfferModalComponent {
  @Input() isOpen: WritableSignal<boolean> = signal(false);
}
