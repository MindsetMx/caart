import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Uppy } from '@uppy/core';
import Spanish from '@uppy/locales/lib/es_ES';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { states } from '@shared/states';
import { VehicleMemorabiliaService } from '@app/register-car/services/vehicle-memorabilia.service';
import { AppService } from '@app/app.service';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
import { environments } from '@env/environments';
import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';

@Component({
  selector: 'vehicle-memorabilia-component',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    UppyAngularDashboardModule,
    NgxMaskDirective
  ],
  templateUrl: './vehicle-memorabilia-component.component.html',
  styleUrl: './vehicle-memorabilia-component.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleMemorabiliaComponentComponent {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild.required<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild.required<ElementRef>('uppyDashboardVideos');

  vehicleMemorabiliaForm: FormGroup;
  isButtonRegisterMemorabiliaDisabled = signal(false);
  states = signal<string[]>(states);
  uploadImageUrl = signal<string>('');
  initializated: boolean = false;

  #validatorsService = inject(ValidatorsService);
  #vehicleMemorabiliaService = inject(VehicleMemorabiliaService);
  #router = inject(Router);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  get photos(): FormControl {
    return this.vehicleMemorabiliaForm.get('photos') as FormControl;
  }

  get videos(): FormControl {
    return this.vehicleMemorabiliaForm.get('videos') as FormControl;
  }

  uppyDashboardImagesEffect = effect(() => {
    if (this.uploadImageUrl() && this.uppyDashboardImages()) {
      if (this.initializated) {
        this.uppyImages?.getPlugin('XHRUpload')?.setOptions({
          endpoint: this.uploadImageUrl(),
        });

        return;
      }

      this.uppyImages = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          // maxFileSize: 1000000,
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
          target: this.uppyDashboardImages()?.nativeElement,
          proudlyDisplayPoweredByUppy: false,
          locale: {
            strings: {
              dropPasteFiles: 'Arrastra y suelta tus imágenes aquí o %{browse}',
            }
          }
        })
        .use(XHRUpload, {
          endpoint: this.uploadImageUrl(),
          formData: true,
          fieldName: 'file',
          allowedMetaFields: [],
        })
        .on('complete', (result) => {
          result.successful.forEach((file: any) => {
            const url = file.response.body.result.variants[0];
            this.photos.setValue([...this.photos.value, url]);
            this.uppyDashboardImages()?.nativeElement.click();

            file.meta['uploadURL'] = url;

            this.uploadImageDirect();
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.photos.setValue(this.photos.value.filter((url: string) => url !== urlToRemove));
        });

      this.initializated = true;
    }
  });

  uppyDashboardVideosEffect = effect(() => {
    this.uppyVideos = new Uppy({
      debug: true,
      autoProceed: true,
      locale: Spanish,
      restrictions: {
        // maxFileSize: 1000000,
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
        target: this.uppyDashboardVideos()?.nativeElement,
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
        headers: {
          'Authorization': `Bearer ${this.#cloudflareToken}`,
        },
      })
      .on('complete', (result) => {
        result.successful.forEach((file: any) => {
          const url = file.response.body.result.preview;
          this.videos.setValue([...this.videos.value, url]);

          this.uppyDashboardVideos()?.nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        this.videos.setValue(this.videos.value.filter((url: string) => url !== urlToRemove));
      });
  });

  constructor() {
    this.vehicleMemorabiliaForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      history: new FormControl('', [Validators.required]),
      materials: new FormControl('', [Validators.required]),
      dimensions: new FormControl('', [Validators.required]),
      hasSignature: new FormControl('', [Validators.required]),
      hasAuthenticityCertificate: new FormControl('', [Validators.required]),
      technicalSheet: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      reserve: new FormControl('', [Validators.required]),
      reserveAmount: new FormControl(''),
      stateOfMemorabilia: new FormControl('', [Validators.required]),
      photos: new FormControl([], [Validators.required]),
      videos: new FormControl([]),
      additionalInformation: new FormControl('', [Validators.required]),
    });

    this.uploadImageDirect();
  }

  registerVehicleMemorabilia(): void {
    this.isButtonRegisterMemorabiliaDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.vehicleMemorabiliaForm);

    if (!isValid) {
      this.isButtonRegisterMemorabiliaDisabled.set(false);
      return;
    }

    this.#vehicleMemorabiliaService.registerMemorabilia$(this.vehicleMemorabiliaForm).subscribe({
      next: () => {
        this.vehicleMemorabiliaForm.reset();
        this.photos.setValue([]);
        this.videos.setValue([]);

        // this.uppyImages?.cancelAll();
        // this.uppyVideos?.cancelAll();

        this.#router.navigate(['registro-exitoso']);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonRegisterMemorabiliaDisabled.set(false);
    });
  }

  uploadImageDirect(): void {
    this.#cloudinaryCroppedImageService.uploadImageDirect$().subscribe({
      next: (response) => {
        this.uploadImageUrl.set(response.result.uploadURL);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.vehicleMemorabiliaForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.vehicleMemorabiliaForm) return undefined;

    return this.#validatorsService.getError(this.vehicleMemorabiliaForm, field);
  }
}
