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
  uppyDashboard = viewChild.required<ElementRef>('uppyDashboard');

  vehicleMemorabiliaForm: FormGroup;
  isButtonRegisterMemorabiliaDisabled = signal(false);
  states = signal<string[]>(states);

  #validatorsService = inject(ValidatorsService);
  #vehicleMemorabiliaService = inject(VehicleMemorabiliaService);
  #appService = inject(AppService);

  uppy?: Uppy;

  get photos(): FormControl {
    return this.vehicleMemorabiliaForm.get('photos') as FormControl;
  }

  get videos(): FormControl {
    return this.vehicleMemorabiliaForm.get('videos') as FormControl;
  }

  uppyDashboardEffect = effect(() => {
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
        target: this.uppyDashboard().nativeElement,
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
            this.photos.setValue([...this.photos.value, url]);
          } else if (file?.type?.includes('video')) {
            this.videos.setValue([...this.videos.value, url]);
          }
          this.uppyDashboard().nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        if (file?.type?.includes('image')) {
          this.photos.setValue(this.photos.value.filter((url: string) => url !== urlToRemove));
        } else if (file?.type?.includes('video')) {
          this.videos.setValue(this.videos.value.filter((url: string) => url !== urlToRemove));
        }
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

        this.uppy?.cancelAll();

        this.toastSuccess('Memorabilia registrada con éxito');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonRegisterMemorabiliaDisabled.set(false);
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.vehicleMemorabiliaForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.vehicleMemorabiliaForm) return undefined;

    return this.#validatorsService.getError(this.vehicleMemorabiliaForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
