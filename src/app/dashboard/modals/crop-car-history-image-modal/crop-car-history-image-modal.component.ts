import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'crop-car-history-image-modal',
  standalone: true,
  imports: [
    ModalComponent
  ],
  templateUrl: './crop-car-history-image-modal.component.html',
  styleUrl: './crop-car-history-image-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropCarHistoryImageModalComponent {
  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
