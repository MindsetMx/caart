import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'general-details-and-exterior-of-the-car',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    UppyAngularDashboardModule,
    DecimalPipe
  ],
  templateUrl: './general-details-and-exterior-of-the-car.component.html',
  styleUrl: './general-details-and-exterior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDetailsAndExteriorOfTheCarComponent implements OnInit, AfterViewInit {
  @ViewChild('uppyDashboard') uppyDashboard!: ElementRef;

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

  originalAuctionCarIdChangedEffect = effect(() => {
    this.getGeneralInformation();
  });

  constructor() {
    this.exteriorOfTheCarForm = this.#fb.group({
      kmInput: [{ value: '', disabled: true }],
      brand: [{ value: '', disabled: true }, [Validators.required]],
      year: [{ value: '', disabled: true }, [Validators.required, Validators.min(1500), Validators.max(this.currentYear)]],
      carModel: [{ value: '', disabled: true }, [Validators.required]],
      // mileage: ['', [Validators.required]],
      odometerVerified: ['true', [Validators.required]],
      transmissionType: [{ value: '', disabled: true }, [Validators.required]],
      otherTransmission: [{ value: '', disabled: true }],
      // sellerType: ['', [Validators.required]],
      VIN: ['KNDJ23AU4N7154467', [Validators.required]],
      warranties: ['false', [Validators.required]],
      wichWarranties: [''],
      invoiceType: ['invoice', [Validators.required]],
      invoiceDetails: ['invoiceDetails', [Validators.required]],
      carHistory: ['carHistory', [Validators.required]],
      exteriorColor: [{ value: '', disabled: true }, [Validators.required]],
      specificColor: [{ value: '', disabled: true }, [Validators.required]],
      accident: ['false', [Validators.required]],
      raced: ['false', [Validators.required]],
      originalPaint: ['false', [Validators.required]],
      paintMeter: ['false', [Validators.required]],
      exteriorModified: ['false', [Validators.required]],
      exteriorCondition: ['excellent', [Validators.required]],
      detailComments: ['detailComments', [Validators.required]],
      exteriorPhotos: [[
        'https://res.cloudinary.com/dfadvv7yu/image/upload/v1712270165/TEST_tgelx6.jpg',
        'https://res.cloudinary.com/dfadvv7yu/image/upload/v1712270165/TEST_tgelx6.jpg',
        'https://res.cloudinary.com/dfadvv7yu/image/upload/v1712270165/TEST_tgelx6.jpg',
        'https://res.cloudinary.com/dfadvv7yu/image/upload/v1712270165/TEST_tgelx6.jpg',
      ], [Validators.required]],
      exteriorVideos: [[
        'https://res.cloudinary.com/dfadvv7yu/video/upload/v1712181677/hn9zgzlougnrb8n38tf6.mp4',
        'https://res.cloudinary.com/dfadvv7yu/video/upload/v1712181677/hn9zgzlougnrb8n38tf6.mp4',
        'https://res.cloudinary.com/dfadvv7yu/video/upload/v1712181677/hn9zgzlougnrb8n38tf6.mp4',
        'https://res.cloudinary.com/dfadvv7yu/video/upload/v1712181677/hn9zgzlougnrb8n38tf6.mp4',
      ]],
      originalAuctionCarId: [this.originalAuctionCarId(), [Validators.required]],
    });
  }

  get specificColorControl(): FormControl {
    return this.exteriorOfTheCarForm.get('specificColor') as FormControl;
  }

  get exteriorColorControl(): FormControl {
    return this.exteriorOfTheCarForm.get('exteriorColor') as FormControl;
  }

  get carModelControl(): FormControl {
    return this.exteriorOfTheCarForm.get('carModel') as FormControl;
  }

  get yearControl(): FormControl {
    return this.exteriorOfTheCarForm.get('year') as FormControl;
  }

  get brandControl(): FormControl {
    return this.exteriorOfTheCarForm.get('brand') as FormControl;
  }

  get kmInputControl(): FormControl {
    return this.exteriorOfTheCarForm.get('kmInput') as FormControl;
  }

  get transmissionTypeControl(): FormControl {
    return this.exteriorOfTheCarForm.get('transmissionType') as FormControl;
  }

  get otherTransmissionControl(): FormControl {
    return this.exteriorOfTheCarForm.get('otherTransmission') as FormControl;
  }

  get wichWarrantiesControl(): FormControl {
    return this.exteriorOfTheCarForm.get('wichWarranties') as FormControl;
  }

  get warrantiesControl(): FormControl {
    return this.exteriorOfTheCarForm.get('warranties') as FormControl;
  }

  get originalAuctionCarId(): WritableSignal<string> {
    return this.#completeCarRegistrationService.originalAuctionCarId;
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
    this.getColors();

    this.warrantiesControl.valueChanges.subscribe((value) => {
      if (value === 'true') {
        this.wichWarrantiesControl?.setValidators([Validators.required]);
      } else {
        this.wichWarrantiesControl?.clearValidators();
      }

      this.wichWarrantiesControl?.updateValueAndValidity();
    });

    this.transmissionTypeControl.valueChanges.subscribe((value) => {
      if (value === 'Otro') {
        this.otherTransmissionControl?.setValidators([Validators.required]);
      } else {
        this.otherTransmissionControl?.clearValidators();
      }

      this.otherTransmissionControl?.updateValueAndValidity();
    });
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
            this.exteriorPhotos.setValue([...this.exteriorPhotos.value, url]);
          } else if (file?.type?.includes('video')) {
            this.exteriorVideos.setValue([...this.exteriorVideos.value, url]);
          }
          this.uppyDashboard.nativeElement.click();

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

    this.kmInputControl.enable();
    this.brandControl.enable();
    this.yearControl.enable();
    this.carModelControl.enable();
    this.transmissionTypeControl.enable();
    this.otherTransmissionControl.enable();
    this.exteriorColorControl.enable();
    this.specificColorControl.enable();

    this.#completeCarRegistrationService.saveGeneralDetailsAndExteriorOfTheCar$(this.exteriorOfTheCarForm)
      .subscribe({
        next: () => {
          this.#completeCarRegistrationService.indexTargetStep.set(2);
          this.#completeCarRegistrationService.indexCurrentStep.set(2);

          window.scrollTo(0, 0);
        },
        error: (error) => {
          this.kmInputControl.disable();
          this.brandControl.disable();
          this.yearControl.disable();
          this.carModelControl.disable();
          this.transmissionTypeControl.disable();
          this.otherTransmissionControl.disable();
          this.exteriorColorControl.disable();
          this.specificColorControl.disable();
          console.error(error);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  getGeneralInformation(): void {
    this.#completeCarRegistrationService.getGeneralInformation$(this.originalAuctionCarId()).subscribe({
      next: (response) => {
        const {
          VIN,
          kmInput,
          brand,
          year,
          carModel,
          odometerVerified,
          transmissionType,
          otherTransmission,
          warranties,
          wichWarranties,
          invoiceType,
          invoiceDetails,
          carHistory,
          exteriorColor,
          specificColor,
          accident,
          raced,
          originalPaint,
          paintMeter,
          exteriorModified,
          exteriorCondition,
          detailComments,
          exteriorPhotos,
          exteriorVideos,
        } = response;

        console.log(response);

        const filteredResponse = Object.fromEntries(
          Object.entries(response).filter(([key, value]) => value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0))
        );

        this.exteriorOfTheCarForm.patchValue(filteredResponse);

        this.previewImagesCarExterior.set(exteriorPhotos);
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
