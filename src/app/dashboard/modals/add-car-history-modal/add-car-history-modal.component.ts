import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'car-history-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CKEditorModule,
  ],
  templateUrl: './add-car-history-modal.component.html',
  styleUrl: './add-car-history-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarHistoryModalComponent {
  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();

  public Editor = ClassicEditor;
  public config = {
    placeholder: 'Ingrese la historia del auto...',
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
    ],
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
