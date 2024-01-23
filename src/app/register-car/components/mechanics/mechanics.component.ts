import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-mechanics',
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
export class MechanicsComponent implements AfterViewInit {
  @ViewChild('uppyDashboard') uppyDashboard!: ElementRef;

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  mechanicsForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  uppy?: Uppy;

  constructor() {
    this.mechanicsForm = this.#fb.group({
      originalRims: ['', [Validators.required]],
      // rimsDetail: ['', [Validators.required]],
      tireBrand: ['', [Validators.required]],
      tireCondition: ['', [Validators.required]],
      extraTiresOrRims: ['', [Validators.required]],
      // extraBrand: ['', [Validators.required]],
      // extraColor: ['', [Validators.required]],
      // extraSize: ['', [Validators.required]],
      spareTire: ['', [Validators.required]],
      originalTransmissionEngine: ['', [Validators.required]],
      improvementModificationOriginal: ['', [Validators.required]],
      // whatImprovement: ['', [Validators.required]],
      performedServicesWithDates: ['', [Validators.required]],
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
      servicesDoneWithDates: ['', [Validators.required]],
      // improvementOrModification: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    console.log('this.uppyDashboard.nativeElement', this.uppyDashboard.nativeElement);

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
            this.mechanicsPhotos.setValue([...this.mechanicsPhotos.value, url]);
          } else if (file?.type?.includes('video')) {
            this.mechanicsVideos.setValue([...this.mechanicsVideos.value, url]);
          }
          this.uppyDashboard.nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        if (file?.type?.includes('image')) {
          this.mechanicsPhotos.setValue(this.mechanicsPhotos.value.filter((url: string) => url !== urlToRemove));
        } else if (file?.type?.includes('video')) {
          this.mechanicsVideos.setValue(this.mechanicsVideos.value.filter((url: string) => url !== urlToRemove));
        }
      });
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
      },
      error: (error) => {
        console.log('error', error);
      },
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
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
