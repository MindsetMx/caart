import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-mechanics',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './mechanics.component.html',
  styleUrl: './mechanics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MechanicsComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  mechanicsForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  constructor() {
    this.mechanicsForm = this.#fb.group({
      hasOriginalRims: ['', [Validators.required]],
      tireBrand: ['', [Validators.required]],
      tireCondition: ['', [Validators.required]],
      hasExtraTiresOrRims: ['', [Validators.required]],
      hasSpareTire: ['', [Validators.required]],
      hasOriginalTransmissionAndMotor: ['', [Validators.required]],
      hasGeneralImprovementOrModification: ['', [Validators.required]],
      servicesPerformedWithDates: ['', [Validators.required]],
      hasMechanicalProblemOrDetail: ['', [Validators.required]],
      hasSensorLitOnTheDashboard: ['', [Validators.required]],
      hasFactoryEquipment: ['', [Validators.required]],
      hasExtraEquipment: ['', [Validators.required]],
      commentsOnDetails: ['', [Validators.required]],
      mechanicsImagesOrVideos: this.#fb.array([
        [''],
      ], [Validators.required]),
    });
  }

  get mechanicsImagesOrVideosFormArray(): FormArray {
    return this.mechanicsForm.get('mechanicsImagesOrVideos') as FormArray;
  }

  exteriorOfTheCarFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.mechanicsForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  selectFile(event: Event, indice: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files?.length) return;

    const file = inputElement.files[0];
    this.mechanicsImagesOrVideosFormArray.at(indice).setValue(file);

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
    return this.#validatorsService.hasError(this.mechanicsForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.mechanicsForm) return undefined;

    return this.#validatorsService.getError(this.mechanicsForm, field);
  }
}
