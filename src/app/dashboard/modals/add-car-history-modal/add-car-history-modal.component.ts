import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'add-car-history-modal',
  standalone: true,
  imports: [
    ModalComponent
  ],
  templateUrl: './add-car-history-modal.component.html',
  styleUrl: './add-car-history-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarHistoryModalComponent {
  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
