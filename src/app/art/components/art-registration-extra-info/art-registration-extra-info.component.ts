import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { MatIcon } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { bothOrNoneValidator } from '@shared/validations';

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
    SpinnerComponent,
    MatIcon,
    NgxMaskDirective,
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

  get additionalChargesFormArray(): FormArray {
    return this.extraInfoForm.get('additionalCharges') as FormArray;
  }

  get additionalChargesFormArrayControls(): FormGroup[] {
    return this.additionalChargesFormArray.controls as FormGroup[];
  }

  uppyDashboardImagesEffect = effect(() => {
    if (this.token()) {
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
      // certificadoAutenticidad: ['', Validators.required],
      // entidadCertificado: ['', Validators.required],
      // entregaConMarco: ['', Validators.required],
      // firmaArtista: ['', Validators.required],
      // procedenciaObra: ['', Validators.required],
      // historiaArtista: [''],
      // photos: [[]],

      certificadoAutenticidad: [true, Validators.required],
      entidadCertificado: ['Entidad de prueba', Validators.required],
      entregaConMarco: [true, Validators.required],
      firmaArtista: [false, Validators.required],
      procedenciaObra: ['Museo de Arte Moderno, Nueva York', Validators.required],
      historiaArtista: ['Nacido en 1977 en Barcelona, España. Estudió Bellas Artes en la Universidad de Barcelona. Ha expuesto su obra en varias galerías internacionales.'],
      photos: [[]],
      additionalCharges: this.#fb.array(
        [
          this.#fb.group({
            chargeType: [''],
            amount: [''],
          }, { validators: bothOrNoneValidator() })
        ]
      ),
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

  addAdditionalCharge(): void {
    const nuevoCredito = this.#fb.group({
      chargeType: [''],
      amount: [''],
    }, { validators: bothOrNoneValidator() });

    this.additionalChargesFormArray.push(nuevoCredito);
  }

  removeAdditionalCharge(index: number): void {
    this.additionalChargesFormArray.removeAt(index);
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
        this.#router.navigate(['/registro-completado'], { replaceUrl: true });
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

  formArrayHasError(formArray: FormArray = this.additionalChargesFormArray, index: number): boolean {
    return this.#validatorsService.formArrayHasError(formArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    return this.#validatorsService.getErrorFromFormArray(this.additionalChargesFormArray, index);
  }
}
