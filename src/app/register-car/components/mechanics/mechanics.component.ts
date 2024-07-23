import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, effect, inject, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { environments } from '@env/environments';
import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';

@Component({
  selector: 'mechanics',
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
  templateUrl: './mechanics.component.html',
  styleUrl: './mechanics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MechanicsComponent {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild.required<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild.required<ElementRef>('uppyDashboardVideos');

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  mechanicsForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);
  token = signal<string>('');

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  originalAuctionCarIdChangedEffect = effect(() => {
    this.getMechanics();
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
          result.successful.forEach((file: any) => {
            const url = file.response.body.result.variants[0];

            this.mechanicsPhotos.setValue([...this.mechanicsPhotos.value, url]);

            this.uppyDashboardImages().nativeElement.click();

            file.meta['uploadURL'] = url;
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.mechanicsPhotos.setValue(this.mechanicsPhotos.value.filter((url: string) => url !== urlToRemove));
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
        result.successful.forEach((file: any) => {
          const url = file.response.body.result.preview;

          this.mechanicsVideos.setValue([...this.mechanicsVideos.value, url]);

          this.uppyDashboardVideos().nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        this.mechanicsVideos.setValue(this.mechanicsVideos.value.filter((url: string) => url !== urlToRemove));
      });
  });

  constructor() {
    this.mechanicsForm = this.#fb.group({
      originalRims: ['', [Validators.required]],
      // rimsDetail: ['', [Validators.required]],
      tireBrand: [''],
      tireSize: [''],
      tireDate: [''],
      tireCondition: ['', [Validators.required]],
      extraTiresOrRims: ['', [Validators.required]],
      // extraBrand: ['', [Validators.required]],
      // extraColor: ['', [Validators.required]],
      // extraSize: ['', [Validators.required]],
      spareTire: ['', [Validators.required]],
      originalTransmissionEngine: ['', [Validators.required]],
      improvementModificationOriginal: ['', [Validators.required]],
      // whatImprovement: ['', [Validators.required]],
      performedServicesWithDates: [''],
      mechanicalProblemDetail: ['', [Validators.required]],
      // whatMechanicalProblem: ['', [Validators.required]],
      illuminatedDashboardSensor: ['', [Validators.required]],
      // whichIlluminatedSensor: ['', [Validators.required]],
      factoryEquipment: ['', [Validators.required]],
      extraEquipment: ['', [Validators.required]],
      // whatExtraEquipment: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      mechanicsPhotos: [[], [Validators.required]],
      mechanicsVideos: [[]],
      originalAuctionCarId: [this.originalAuctionCarId, [Validators.required]],
      // dashboardWarningLight: ['', [Validators.required]],
      // servicesDoneWithDates: ['', [Validators.required]],
      // improvementOrModification: ['', [Validators.required]],
    });

    this.batchTokenDirect();
  }

  get mechanicsPhotos(): FormControl {
    return this.mechanicsForm.get('mechanicsPhotos') as FormControl;
  }

  get mechanicsVideos(): FormControl {
    return this.mechanicsForm.get('mechanicsVideos') as FormControl;
  }

  get originalAuctionCarId(): string {
    return this.#completeCarRegistrationService.originalAuctionCarId();
  }

  mechanicsFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.mechanicsForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveMechanics$(this.mechanicsForm).subscribe({
      next: () => {
        this.#completeCarRegistrationService.indexTargetStep.set(4);
        this.#completeCarRegistrationService.indexCurrentStep.set(4);

        window.scrollTo(0, 0);
      },
      error: (error) => console.error(error),
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getMechanics(): void {
    this.#completeCarRegistrationService.getMechanics$(this.originalAuctionCarId).subscribe({
      next: (mechanics) => {
        let {
          originalRims,
          tireBrand,
          tireSize,
          tireDate,
          tireCondition,
          extraTiresOrRims,
          spareTire,
          originalTransmissionEngine,
          improvementModificationOriginal,
          performedServicesWithDates,
          mechanicalProblemDetail,
          illuminatedDashboardSensor,
          factoryEquipment,
          extraEquipment,
          comments,
          mechanicsPhotos,
          mechanicsVideos,
        } = mechanics.data.attributes;

        //Sobreescribir con valores de prueba
        originalRims = true;
        tireBrand = 'Michelin';
        tireSize = '205/55 R16';
        tireDate = '2021-08-01';
        tireCondition = 'Excelente';
        extraTiresOrRims = 'false';
        spareTire = true;
        originalTransmissionEngine = true;
        improvementModificationOriginal = true;
        performedServicesWithDates = 'Cambio de aceite 2021-08-01';
        mechanicalProblemDetail = false;
        illuminatedDashboardSensor = true;
        factoryEquipment = false;
        extraEquipment = false;
        comments = 'Comentarios de prueba';
        mechanicsPhotos = (mechanicsPhotos && mechanicsPhotos.length > 0) ? mechanicsPhotos : ['https://imagedelivery.net/0QBC7WyyrF76Zf9i8s__Sg/79c2c836-05b7-4063-de6f-1a8e105eaa00/public', 'https://imagedelivery.net/0QBC7WyyrF76Zf9i8s__Sg/27c09383-2145-475d-4992-7b7ecc191200/public'];

        this.mechanicsForm.patchValue({
          originalRims,
          tireBrand,
          tireSize,
          tireDate,
          tireCondition,
          extraTiresOrRims,
          spareTire,
          originalTransmissionEngine,
          improvementModificationOriginal,
          performedServicesWithDates,
          mechanicalProblemDetail,
          illuminatedDashboardSensor,
          factoryEquipment,
          extraEquipment,
          comments,
          mechanicsPhotos,
          mechanicsVideos,
        });
      },
      error: (error) => console.error(error),
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
    return this.#validatorsService.hasError(this.mechanicsForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.mechanicsForm) return undefined;

    return this.#validatorsService.getError(this.mechanicsForm, field);
  }
}
