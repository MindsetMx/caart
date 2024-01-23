import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { Colors } from '@app/register-car/interfaces/colors';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
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
    SpinnerComponent,
    UppyAngularDashboardModule,
  ],
  templateUrl: './interior-of-the-car.component.html',
  styleUrl: './interior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteriorOfTheCarComponent implements OnInit, AfterViewInit {
  @ViewChild('uppyDashboard') uppyDashboard!: ElementRef;

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  interiorOfTheCarForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarInterior: WritableSignal<string[]> = signal(['', '']);
  colors: WritableSignal<Colors[]> = signal([]);

  uppy?: Uppy;

  constructor() {
    this.interiorOfTheCarForm = this.#fb.group({
      color: ['', [Validators.required]],
      material: ['', [Validators.required]],
      interiorCondition: ['', [Validators.required]],
      interiorModifications: ['', [Validators.required]],
      accessoriesFunctioning: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      interiorPhotos: [[], [Validators.required]],
      interiorVideos: [[]],
      originalAuctionCarId: [this.originalAuctionCarId, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getColors();
  }

  ngAfterViewInit(): void {
    this.uppy = new Uppy({
      debug: true,
      autoProceed: true,
      locale: Spanish,
      meta: {
        upload_preset: 'if8y72iv',
        api_key: '218199524155838',
      },
      restrictions: {
        // maxFileSize: 1000000,
        // maxNumberOfFiles: 20,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/*', 'video/*'],
      },
    }).use(Dashboard,
      {
        height: 300,
        hideUploadButton: true,
        hideCancelButton: true,
        showRemoveButtonAfterComplete: true,
        showProgressDetails: true,
        inline: true,
        hideProgressAfterFinish: true,
        target: this.uppyDashboard.nativeElement,
        proudlyDisplayPoweredByUppy: false,
        locale: {
          strings: {
            dropPasteFiles: 'Arrastra y suelta tus fotos aquí o %{browse}',
          }
        }
      })
      .use(XHRUpload, {
        endpoint: 'https://api.cloudinary.com/v1_1/dv7skd1y3/upload',
        formData: true,
        fieldName: 'file',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        allowedMetaFields: ['upload_preset', 'api_key'],
      })
      .on('complete', (result) => {
        result.successful.forEach(file => {
          const url = file.uploadURL;

          if (file?.type?.includes('image')) {
            this.interiorPhotos.setValue([...this.interiorPhotos.value, url]);
          } else if (file?.type?.includes('video')) {
            this.interiorVideos.setValue([...this.interiorVideos.value, url]);
          }
          this.uppyDashboard.nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        if (file?.type?.includes('image')) {
          this.interiorPhotos.setValue(this.interiorPhotos.value.filter((url: string) => url !== urlToRemove));
        } else if (file?.type?.includes('video')) {
          this.interiorVideos.setValue(this.interiorVideos.value.filter((url: string) => url !== urlToRemove));
        }
      });
  }

  get interiorPhotos(): FormControl {
    return this.interiorOfTheCarForm.get('interiorPhotos') as FormControl;
  }

  get interiorVideos(): FormControl {
    return this.interiorOfTheCarForm.get('interiorVideos') as FormControl;
  }

  get originalAuctionCarId(): string {
    return this.#completeCarRegistrationService.originalAuctionCarId();
  }

  get photosOrVideosInteriorOfTheCarFormArray(): FormArray {
    return this.interiorOfTheCarForm.get('interiorImagesOrVideos') as FormArray;
  }

  exteriorOfTheCarFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.interiorOfTheCarForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveInteriorOfTheCar$(this.interiorOfTheCarForm).subscribe({
      next: () => {
        this.#completeCarRegistrationService.changeStep(3);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getColors(): void {
    this.#completeCarRegistrationService.getColors$().subscribe({
      next: (colors: Colors[]) => {
        this.colors.set(colors);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.interiorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.interiorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.interiorOfTheCarForm, field);
  }
}
