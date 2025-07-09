import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, effect, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Uppy } from '@uppy/core';
import Spanish from '@uppy/locales/lib/es_ES';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { DecimalPipe } from '@angular/common';
import { environments } from '@env/environments';
import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';
import { NgxMaskDirective } from 'ngx-mask';
import { UserData } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';

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
    DecimalPipe,
    NgxMaskDirective,
  ],
  templateUrl: './general-details-and-exterior-of-the-car.component.html',
  styleUrl: './general-details-and-exterior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDetailsAndExteriorOfTheCarComponent implements OnInit {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild.required<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild.required<ElementRef>('uppyDashboardVideos');

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #authService = inject(AuthService);

  exteriorOfTheCarForm: FormGroup;
  currentYear = new Date().getFullYear();
  brands: WritableSignal<string[]> = signal([]);
  token = signal<string>('');

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  originalAuctionCarIdChangedEffect = effect(() => {
    this.getGeneralInformation();
  });

  uppyDashboardImagesEffect = effect(() => {
    if (this.uppyDashboardImages() && this.token()) {
      this.uppyImages = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 15000000,
          // maxNumberOfFiles: 20,
          minNumberOfFiles: 1,
          allowedFileTypes: ['image/*'],
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
          target: this.uppyDashboardImages().nativeElement,
          proudlyDisplayPoweredByUppy: false,
          locale: {
            strings: {
              dropPasteFiles: 'Arrastra y suelta tus fotos aquí o %{browse}',
            }
          }
        })
        .use(XHRUpload, {
          endpoint: 'https://batch.imagedelivery.net/images/v1',
          formData: true,
          fieldName: 'file',
          allowedMetaFields: [],
          limit: 1,
          headers: {
            'Authorization': 'Bearer ' + this.token(),
          }
        })
        .on('complete', (result) => {
          result.successful.forEach((file: any) => {
            const url = file.response.body.result.variants[0];
            this.exteriorPhotos.setValue([...this.exteriorPhotos.value, url]);
            this.uppyDashboardImages().nativeElement.click();

            file.meta['uploadURL'] = url;
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.exteriorPhotos.setValue(this.exteriorPhotos.value.filter((url: string) => url !== urlToRemove));
        });
    }
  });

  uppyDashboardVideosEffect = effect(() => {
    this.uppyVideos = new Uppy({
      debug: true,
      autoProceed: true,
      locale: Spanish,
      restrictions: {
        maxFileSize: 500000000,
        // maxNumberOfFiles: 20,
        minNumberOfFiles: 1,
        allowedFileTypes: ['video/*'],
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
        target: this.uppyDashboardVideos().nativeElement,
        proudlyDisplayPoweredByUppy: false,
        locale: {
          strings: {
            dropPasteFiles: 'Arrastra y suelta tus videos aquí o %{browse}',
          }
        }
      })
      .use(XHRUpload, {
        endpoint: `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/stream`,
        formData: true,
        fieldName: 'file',
        limit: 1,
        headers: {
          'Authorization': `Bearer ${this.#cloudflareToken}`,
        },
      })
      .on('complete', (result) => {
        result.successful.forEach((file: any) => {
          const url = file.response.body.result.preview;
          this.exteriorVideos.setValue([...this.exteriorVideos.value, url]);

          this.uppyDashboardVideos().nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        this.exteriorVideos.setValue(this.exteriorVideos.value.filter((url: string) => url !== urlToRemove));
      });
  });

  constructor() {
    this.exteriorOfTheCarForm = this.#fb.group({
      kmInput: [{ value: '', disabled: true }],
      brand: [{ value: '', disabled: true }, [Validators.required]],
      year: [{ value: '', disabled: true }, [Validators.required, Validators.min(1500), Validators.max(this.currentYear)]],
      carModel: [{ value: '', disabled: true }, [Validators.required]],
      invoiceType: ['', [Validators.required]],
      invoiceDetails: ['', [Validators.required]],
      carHistory: ['', [Validators.required]],
      exteriorPhotos: [[]],
      exteriorVideos: [[]],
      originalAuctionCarId: [this.originalAuctionCarId(), [Validators.required]],
    });

    this.batchTokenDirect();
  }

  get user(): UserData | null {
    return this.#authService.currentUser();
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

  get originalAuctionCarId(): WritableSignal<string> {
    return this.#completeCarRegistrationService.originalAuctionCarId;
  }

  get exteriorPhotos(): FormControl {
    return this.exteriorOfTheCarForm.get('exteriorPhotos') as FormControl;
  }

  get exteriorVideos(): FormControl {
    return this.exteriorOfTheCarForm.get('exteriorVideos') as FormControl;
  }

  ngOnInit(): void {
    // this.getColors();
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

          window.scrollTo(0, 0);
        },
        error: (error) => {
          console.error(error);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  getGeneralInformation(): void {
    this.#completeCarRegistrationService.getGeneralInformation$(this.originalAuctionCarId()).subscribe({
      next: (response) => {
        let {
          kmInput,
          brand,
          year,
          carModel,
          invoiceType,
          invoiceDetails,
          carHistory,
          exteriorPhotos,
          exteriorVideos,
        } = response;

        exteriorPhotos = exteriorPhotos ?? [];
        exteriorVideos = exteriorVideos ?? [];


        this.exteriorOfTheCarForm.patchValue({
          kmInput,
          brand,
          year,
          carModel,
          invoiceType,
          invoiceDetails,
          carHistory,
          exteriorPhotos,
          exteriorVideos,
        });

        this.previewImagesCarExterior.set(exteriorPhotos);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  batchTokenDirect(): void {
    this.#cloudinaryCroppedImageService.batchTokenDirect$().
      subscribe({
        next: (response) => {
          this.token.set(response.result.token);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  // getColors(): void {
  //   this.#completeCarRegistrationService.getColors$().subscribe({
  //     next: (colors: Colors[]) => {
  //       this.colors.set(colors);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.exteriorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.exteriorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.exteriorOfTheCarForm, field);
  }
}
