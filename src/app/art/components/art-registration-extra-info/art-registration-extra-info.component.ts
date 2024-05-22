import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Uppy } from '@uppy/core';
import Spanish from '@uppy/locales/lib/es_ES';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';

import { CompleteArtRegistrationService } from '@app/art/services/complete-art-registration.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AutoResizeTextareaDirective, InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';
import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';

@Component({
  selector: 'art-registration-extra-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    AutoResizeTextareaDirective,
    InputDirective,
    PrimaryButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './art-registration-extra-info.component.html',
  styleUrl: './art-registration-extra-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRegistrationExtraInfoComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeArtRegistrationService = inject(CompleteArtRegistrationService);
  #router = inject(Router);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  uppyDashboardImages = viewChild.required<ElementRef>('uppyDashboardImages');

  extraInfoForm: FormGroup;

  isButtonSubmitDisabled = signal<boolean>(false);
  token = signal<string>('');

  uppyImages?: Uppy;

  // originalAuctionCarIdChangedEffect = effect(() => {
  //   this.getExtraInfo();
  // });

  get certificadoAutenticidadControl(): FormControl {
    return this.extraInfoForm.get('certificadoAutenticidad') as FormControl;
  }

  get entidadCertificadoControl(): FormControl {
    return this.extraInfoForm.get('entidadCertificado') as FormControl;
  }

  get photos(): FormControl {
    return this.extraInfoForm.get('photos') as FormControl;
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

  constructor() {
    this.extraInfoForm = this.#fb.group({
      certificadoAutenticidad: ['', Validators.required],
      entidadCertificado: ['', Validators.required],
      entregaConMarco: ['', Validators.required],
      firmaArtista: ['', Validators.required],
      procedenciaObra: ['', Validators.required],
      historiaArtista: [''],
      photos: [[]],
      originalAuctionArtId: [this.originalAuctionArtId, Validators.required],
    });

    this.certificadoAutenticidadControl.valueChanges.
      pipe(
        takeUntilDestroyed()
      ).subscribe((value) => {
        if (value === true) {
          this.entidadCertificadoControl.setValidators([Validators.required]);
        } else {
          this.entidadCertificadoControl.setValue('');
          this.entidadCertificadoControl.clearValidators();
        }

        this.entidadCertificadoControl.updateValueAndValidity();
      });

    this.batchTokenDirect();
  }

  get originalAuctionArtId(): string {
    return this.#completeArtRegistrationService.originalAuctionArtId();
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

  carExtrasFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.extraInfoForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeArtRegistrationService.saveArtDetailInfo$(this.extraInfoForm).subscribe({
      next: () => {
        this.#router.navigate(['/registro-completado']);
      },
      error: (error) => console.error(error),
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  // getExtraInfo(): void {
  //   this.#completeArtRegistrationService.getExtraInfo$(this.originalAuctionArtId).subscribe({
  //     next: (extraInfo) => {
  //       const {
  //         certificadoAutenticidad,
  //         entregaConMarco,
  //         firmaArtista,
  //         procedenciaObra,
  //         historiaArtista,
  //       } = extraInfo.data.attributes;

  //       this.extraInfoForm.patchValue({
  //         certificadoAutenticidad,
  //         entregaConMarco,
  //         firmaArtista,
  //         procedenciaObra,
  //         historiaArtista,
  //       });
  //     },
  //     error: (error) => console.error(error),
  //   });
  // }

  hasError(field: string, formGroup: FormGroup = this.extraInfoForm): boolean {
    return this.#validatorsService.hasError(formGroup, field);
  }

  getError(field: string, formGroup: FormGroup = this.extraInfoForm): string | undefined {
    return this.#validatorsService.getError(formGroup, field);
  }
}
