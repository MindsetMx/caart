import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, effect, inject, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Uppy } from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { environments } from '@env/environments';
import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';
import { UserData } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'interior-of-the-car',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './interior-of-the-car.component.html',
  styleUrl: './interior-of-the-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteriorOfTheCarComponent {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild.required<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild.required<ElementRef>('uppyDashboardVideos');

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #authService = inject(AuthService);

  interiorOfTheCarForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarInterior: WritableSignal<string[]> = signal(['', '']);
  token = signal<string>('');

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  originalAuctionCarIdChangedEffect = effect(() => {
    this.getInteriorOfTheCar();
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
            'Authorization': `Bearer ${this.token()}`,
          },
        })
        .on('complete', (result) => {
          result.successful?.forEach((file: any) => {
            const url = file.response.body.result.variants[0];

            this.interiorPhotos.setValue([...this.interiorPhotos.value, url]);

            this.uppyDashboardImages().nativeElement.click();

            file.meta['uploadURL'] = url;
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.interiorPhotos.setValue(this.interiorPhotos.value.filter((url: string) => url !== urlToRemove));
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
        allowedMetaFields: ['requireSignedURLs'],
      })
      .on('complete', (result) => {
        result.successful?.forEach((file: any) => {
          const url = file.response.body.result.preview;

          this.interiorVideos.setValue([...this.interiorVideos.value, url]);

          this.uppyDashboardVideos().nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        this.interiorVideos.setValue(this.interiorVideos.value.filter((url: string) => url !== urlToRemove));
      });
  });

  constructor() {
    this.interiorOfTheCarForm = this.#fb.group({
      interiorColor: ['', [Validators.required]],
      material: ['', [Validators.required]],
      interiorDetails: ['', [Validators.required]],
      interiorPhotos: [[]],
      interiorVideos: [[]],
      originalAuctionCarId: [this.originalAuctionCarId, [Validators.required]],
    });

    this.batchTokenDirect();
  }

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get interiorColorControl(): FormControl {
    return this.interiorOfTheCarForm.get('interiorColor') as FormControl;
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

    this.interiorColorControl.enable();

    this.#completeCarRegistrationService.saveInteriorOfTheCar$(this.interiorOfTheCarForm).subscribe({
      next: () => {
        this.#completeCarRegistrationService.indexTargetStep.set(3);
        this.#completeCarRegistrationService.indexCurrentStep.set(3);

        window.scrollTo(0, 0);
      },
      error: (error) => {
        this.interiorColorControl.disable();
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getInteriorOfTheCar(): void {
    this.#completeCarRegistrationService.getInteriorOfTheCar$(this.originalAuctionCarId).subscribe({
      next: (interiorOfTheCar) => {
        let {
          interiorColor,
          material,
          interiorDetails,
          interiorPhotos,
          interiorVideos,
        } = interiorOfTheCar;


        this.interiorOfTheCarForm.patchValue({
          interiorColor,
          material,
          interiorDetails,
          interiorPhotos,
          interiorVideos,
        });
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

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.interiorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.interiorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.interiorOfTheCarForm, field);
  }
}
