import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Uppy } from '@uppy/core';
import Spanish from '@uppy/locales/lib/es_ES';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';

import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { environments } from '@env/environments';
import { RegisterArtService } from '@app/art/services/register-art.service';

@Component({
  selector: 'art-register',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    UppyAngularDashboardModule,
  ],
  templateUrl: './art-register.component.html',
  styleUrl: './art-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRegisterComponent {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild.required<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild.required<ElementRef>('uppyDashboardVideos');

  registerArtForm: FormGroup;

  isButtonRegisterArtDisabled = signal(false);
  token = signal<string>('');

  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #registerArtService = inject(RegisterArtService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  get photos(): FormControl {
    return this.registerArtForm.get('photos') as FormControl;
  }

  get videos(): FormControl {
    return this.registerArtForm.get('videos') as FormControl;
  }

  get categoryControl(): FormControl {
    return this.registerArtForm.get('category') as FormControl;
  }

  uppyDashboardImagesEffect = effect(() => {
    if (this.token()) {
      this.uppyImages = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 10000000,
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
            this.photos.setValue([...this.photos.value, url]);
            this.uppyDashboardImages()?.nativeElement.click();

            file.meta['uploadURL'] = url;
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.photos.setValue(this.photos.value.filter((url: string) => url !== urlToRemove));
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
    this.registerArtForm = new FormGroup({
      artist: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      materials: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      otherCategory: new FormControl(''),
      rarity: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      width: new FormControl('', [Validators.required]),
      depth: new FormControl(''),
      condition: new FormControl('', [Validators.required]),
      origin: new FormControl('', [Validators.required]),
      photos: new FormControl([], [Validators.required]),
      videos: new FormControl([]),
      acceptTerms: new FormControl('', [Validators.required]),
    });

    this.batchTokenDirect();
  }

  registerArt(): void {
    this.isButtonRegisterArtDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.registerArtForm);

    if (!isValid) {
      this.isButtonRegisterArtDisabled.set(false);
      return;
    }

    this.#registerArtService.registerArt$(this.registerArtForm).subscribe({
      next: () => {
        this.registerArtForm.reset();
        this.photos.setValue([]);
        this.videos.setValue([]);

        this.#router.navigate(['registro-exitoso']);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonRegisterArtDisabled.set(false);
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

  hasError(field: string, form: FormGroup = this.registerArtForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.registerArtForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }
}
