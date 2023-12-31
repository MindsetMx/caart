import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-car-extras',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './car-extras.component.html',
  styleUrl: './car-extras.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarExtrasComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  carExtrasForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  constructor() {
    this.carExtrasForm = this.#fb.group({
      hasServiceHistory: [false, Validators.required],
      hasManuals: [false, Validators.required],
      hasToolBox: [false, Validators.required],
      hasSpareTire: [false, Validators.required],
      hasCarCover: [false, Validators.required],
      hasTireInflator: [false, Validators.required],
      numberOfKeys: ['', Validators.required],
      other: ['', Validators.required],
      additionalCharges: ['', Validators.required],
      amountOfCharge: ['', Validators.required],
      additionalComments: ['', Validators.required],
      acceptTermsAndConditions: [false, Validators.required],
    });
  }

  get detailsImagesOrVideosFormArray(): FormArray {
    return this.carExtrasForm.get('detailsImagesOrVideos') as FormArray;
  }

  get exteriorImagesOrVideosFormArray(): FormArray {
    return this.carExtrasForm.get('exteriorImagesOrVideos') as FormArray;
  }

  carExtrasFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carExtrasForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  selectFile(event: Event, indice: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files?.length) return;

    const file = inputElement.files[0];
    this.detailsImagesOrVideosFormArray.at(indice).setValue(file);

    this.showPreview(file, indice);
  }

  showPreview(archivo: File, indice: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImagesCarDetails.set(
        this.previewImagesCarDetails().map((image, index) => {
          if (index === indice) return reader.result as string;
          return image;
        })
      );
    }
    reader.readAsDataURL(archivo);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.carExtrasForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.carExtrasForm) return undefined;

    return this.#validatorsService.getError(this.carExtrasForm, field);
  }
}
