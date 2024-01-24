import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Uppy } from '@uppy/core';
import Spanish from '@uppy/locales/lib/es_ES';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { Colors } from '@app/register-car/interfaces/colors.interface';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
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
    SpinnerComponent,
    UppyAngularDashboardModule,
  ],
  templateUrl: './general-details-and-exterior-of-the-car.component.html',
  styleUrl: './general-details-and-exterior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDetailsAndExteriorOfTheCarComponent implements OnInit, AfterViewInit {
  @ViewChild('uppyDashboard1') uppyDashboard1!: ElementRef;
  @ViewChild('uppyDashboard2') uppyDashboard2!: ElementRef;

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  exteriorOfTheCarForm: FormGroup;
  currentYear = new Date().getFullYear();
  brands: WritableSignal<string[]> = signal([]);
  colors: WritableSignal<Colors[]> = signal([]);

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  uppy?: Uppy;
  uppy2?: Uppy;

  constructor() {
    this.exteriorOfTheCarForm = this.#fb.group({
      brand: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1930), Validators.max(this.currentYear)]],
      carModel: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      odometerVerified: ['', [Validators.required]],
      transmissionType: ['', [Validators.required]],
      sellerType: ['', [Validators.required]],
      warranties: ['', [Validators.required]],
      invoiceType: ['', [Validators.required]],
      invoiceDetails: ['', [Validators.required]],
      carHistory: ['', [Validators.required]],
      exteriorColor: ['', [Validators.required]],
      specificColor: ['', [Validators.required]],
      accident: ['', [Validators.required]],
      raced: ['', [Validators.required]],
      originalPaint: ['', [Validators.required]],
      paintMeter: ['', [Validators.required]],
      exteriorModified: ['', [Validators.required]],
      exteriorCondition: ['', [Validators.required]],
      detailComments: ['', [Validators.required]],
      detailPhotos: [[], [Validators.required]],
      detailVideos: [[]],
      exteriorPhotos: [[], [Validators.required]],
      exteriorVideos: [[]],
      originalAuctionCarId: [this.originalAuctionCarId(), [Validators.required]],
    });
  }

  get originalAuctionCarId(): WritableSignal<string> {
    return this.#completeCarRegistrationService.originalAuctionCarId;
  }

  set originalAuctionCarId(originalAuctionCarId: string) {
    this.#completeCarRegistrationService.originalAuctionCarId.set(originalAuctionCarId);
  }

  get detailPhotos(): FormControl {
    return this.exteriorOfTheCarForm.get('detailPhotos') as FormControl;
  }

  get detailVideos(): FormControl {
    return this.exteriorOfTheCarForm.get('detailVideos') as FormControl;
  }

  get exteriorPhotos(): FormControl {
    return this.exteriorOfTheCarForm.get('exteriorPhotos') as FormControl;
  }

  get exteriorVideos(): FormControl {
    return this.exteriorOfTheCarForm.get('exteriorVideos') as FormControl;
  }

  ngOnInit(): void {
    this.getBrands();
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
        target: this.uppyDashboard1.nativeElement,
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
            this.detailPhotos.setValue([...this.detailPhotos.value, url]);
          } else if (file?.type?.includes('video')) {
            this.detailVideos.setValue([...this.detailVideos.value, url]);
          }
          this.uppyDashboard1.nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        if (file?.type?.includes('image')) {
          this.detailPhotos.setValue(this.detailPhotos.value.filter((url: string) => url !== urlToRemove));
        } else if (file?.type?.includes('video')) {
          this.detailVideos.setValue(this.detailVideos.value.filter((url: string) => url !== urlToRemove));
        }
      });

    this.uppy2 = new Uppy({
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
        target: this.uppyDashboard2.nativeElement,
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
            this.exteriorPhotos.setValue([...this.exteriorPhotos.value, url]);
          } else if (file?.type?.includes('video')) {
            this.exteriorVideos.setValue([...this.exteriorVideos.value, url]);
          }
          this.uppyDashboard2.nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        if (file?.type?.includes('image')) {
          this.exteriorPhotos.setValue(this.exteriorPhotos.value.filter((url: string) => url !== urlToRemove));
        } else if (file?.type?.includes('video')) {
          this.exteriorVideos.setValue(this.exteriorVideos.value.filter((url: string) => url !== urlToRemove));
        }
      });
  }

  exteriorOfTheCarFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.exteriorOfTheCarForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveGeneralDetailsAndExteriorOfTheCar$(this.exteriorOfTheCarForm)
      .subscribe({
        next: () => {
          this.#completeCarRegistrationService.indexTargetStep.set(2);
          this.#completeCarRegistrationService.indexCurrentStep.set(2);
        },
        error: (error) => {
          console.error(error);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  getBrands(): void {
    this.#completeCarRegistrationService.getBrands$().subscribe({
      next: (response) => {
        this.brands.set(response.data);
      },
      error: (error) => {
        console.error(error);
      }
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
    return this.#validatorsService.hasError(this.exteriorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.exteriorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.exteriorOfTheCarForm, field);
  }
}
