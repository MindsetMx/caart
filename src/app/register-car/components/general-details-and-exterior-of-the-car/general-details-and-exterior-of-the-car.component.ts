import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-general-details-and-exterior-of-the-car',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './general-details-and-exterior-of-the-car.component.html',
  styleUrl: './general-details-and-exterior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDetailsAndExteriorOfTheCarComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  exteriorOfTheCarForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  constructor() {
    this.exteriorOfTheCarForm = this.#fb.group({
      brand: ['', [Validators.required]],
      year: ['', [Validators.required]],
      model: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      isOdometerAccurate: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      sellerType: ['', [Validators.required]],
      carWarranties: ['', [Validators.required]],
      invoiceOrPermit: ['', [Validators.required]],
      invoiceOrPermitDetails: ['', [Validators.required]],
      carHistory: ['', [Validators.required]],
      exteriorColor: ['', [Validators.required]],
      specificColor: ['', [Validators.required]],
      hasBeenInAccident: ['', [Validators.required]],
      hasBeenOnTrack: ['', [Validators.required]],
      isPaintOriginal: ['', [Validators.required]],
      hasPaintMeter: ['', [Validators.required]],
      hasExteriorModification: ['', [Validators.required]],
      exteriorCondition: ['', [Validators.required]],
      detailsComments: ['', [Validators.required]],
      detailsImagesOrVideos: this.#fb.array([
        [''],
      ], [Validators.required]),
      exteriorImagesOrVideos: this.#fb.array([
        ['', [Validators.required]],
      ], [Validators.required]),
    });
  }

  get detailsImagesOrVideosFormArray(): FormArray {
    return this.exteriorOfTheCarForm.get('detailsImagesOrVideos') as FormArray;
  }

  get exteriorImagesOrVideosFormArray(): FormArray {
    return this.exteriorOfTheCarForm.get('exteriorImagesOrVideos') as FormArray;
  }

  submitExteriorOfTheCarForm(): void {
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
    return this.#validatorsService.hasError(this.exteriorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.exteriorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.exteriorOfTheCarForm, field);
  }
}
