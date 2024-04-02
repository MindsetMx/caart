import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '@app/app.service';
import { AuctionCarService } from '@app/dashboard/services/auction-car.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'car-history-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CKEditorModule,
    ReactiveFormsModule,
    InputDirective,
    SpinnerComponent,
    PrimaryButtonDirective,
    InputErrorComponent
  ],
  templateUrl: './add-car-history-modal.component.html',
  styleUrl: './add-car-history-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarHistoryModalComponent {
  isOpen = input.required<boolean>();
  originalAuctionCarId = input.required<string>();
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

  addCarHistoryForm: FormGroup;
  addCarHistorySubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #auctionCarService = inject(AuctionCarService);
  #appService = inject(AppService);

  originalAuctionCarIdEffect = effect(() => {
    console.log({ originalAuctionCarId: this.originalAuctionCarId() });

    this.addCarHistoryForm.reset();
    this.addCarHistoryForm.get('originalAuctionCarId')?.setValue(this.originalAuctionCarId());
  });

  constructor() {
    this.addCarHistoryForm = this.#formBuilder.group({
      originalAuctionCarId: ['', Validators.required],
      content: ['', Validators.required],
      extract: ['', Validators.required],
    });
  }

  addCarHistory(): void {
    this.addCarHistorySubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.addCarHistoryForm);

    if (!isValid) {
      this.addCarHistorySubmitButtonIsDisabled.set(false);
      return;
    }

    this.#auctionCarService.addCarHistory$(this.addCarHistoryForm).subscribe({
      next: (response) => {
        console.log({ response });

        this.addCarHistoryForm.reset();
        this.emitIsOpenChange(false);

        this.toastSuccess('Historia del auto agregada');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.error);
      }
    }).add(() => {
      this.addCarHistorySubmitButtonIsDisabled.set(false);
    });

    // this.#releaseCarForLiveAuctionService.releaseCarForLiveAuction$(this.addCarHistoryForm).subscribe({
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.addCarHistoryForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.addCarHistoryForm) return undefined;

    return this.#validatorsService.getError(this.addCarHistoryForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
