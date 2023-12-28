import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-interior-of-the-car',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './interior-of-the-car.component.html',
  styleUrl: './interior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteriorOfTheCarComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  interiorOfTheCarForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarInterior: WritableSignal<string[]> = signal(['', '']);

  constructor() {
    this.interiorOfTheCarForm = this.#fb.group({
      color: ['', [Validators.required]],
      material: ['', [Validators.required]],
      interiorCondition: ['', [Validators.required]],
      hasInteriorModification: ['', [Validators.required]],
      accessoriesAndElectronicsWork: ['', [Validators.required]],
      detailsComments: ['', [Validators.required]],
      interiorImagesOrVideos: this.#fb.array([
        ['', [Validators.required]],
      ], [Validators.required]),
    });
  }

  get photosOrVideosInteriorOfTheCarFormArray(): FormArray {
    return this.interiorOfTheCarForm.get('interiorImagesOrVideos') as FormArray;
  }

  submitExteriorOfTheCarForm(): void {
  }

  selectFile(event: Event, indice: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files?.length) return;

    const file = inputElement.files[0];
    this.photosOrVideosInteriorOfTheCarFormArray.at(indice).setValue(file);

    this.showPreview(file, indice);
  }

  showPreview(archivo: File, indice: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImagesCarInterior.set(
        this.previewImagesCarInterior().map((image, index) => {
          if (index === indice) return reader.result as string;
          return image;
        })
      );
    }
    reader.readAsDataURL(archivo);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.interiorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.interiorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.interiorOfTheCarForm, field);
  }
}
