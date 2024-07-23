import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from '@app/app.service';
import { WizardData } from '@app/dashboard/interfaces/wizard-data';
import { UpdateAuctionCarDetailsDataService } from '@app/dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'auction-car-mechanical-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
  ],
  templateUrl: './auction-car-mechanical-details.component.html',
  styleUrl: './auction-car-mechanical-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarMechanicalDetailsComponent {
  wizardData = input.required<WizardData>();
  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  #sanitizer = inject(DomSanitizer);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);

  mechanicsForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.mechanicsForm.reset();

      const mechanicsDetails = this.wizardData().data.mechanicsDetails;
      this.mechanicsForm.patchValue({
        originalRims: mechanicsDetails.originalRims,
        // rimsDetail: mechanicsDetails.rimsDetail,
        tireBrand: mechanicsDetails.tireBrand,
        tireSize: mechanicsDetails.tireSize,
        tireDate: mechanicsDetails.tireDate,
        tireCondition: mechanicsDetails.tireCondition,
        extraTiresOrRims: mechanicsDetails.extraTiresOrRims,
        // extraBrand: mechanicsDetails.extraBrand,
        // extraColor: mechanicsDetails.extraColor,
        // extraSize: mechanicsDetails.extraSize,
        spareTire: mechanicsDetails.spareTire,
        originalTransmissionEngine: mechanicsDetails.originalTransmissionEngine,
        improvementModificationOriginal: mechanicsDetails.improvementModificationOriginal,
        // whatImprovement: mechanicsDetails.whatImprovement,
        performedServicesWithDates: mechanicsDetails.performedServicesWithDates,
        mechanicalProblemDetail: mechanicsDetails.mechanicalProblemDetail,
        // whatMechanicalProblem: mechanicsDetails.whatMechanicalProblem,
        illuminatedDashboardSensor: mechanicsDetails.illuminatedDashboardSensor,
        // whichIlluminatedSensor: mechanicsDetails.whichIlluminatedSensor,
        factoryEquipment: mechanicsDetails.factoryEquipment,
        extraEquipment: mechanicsDetails.extraEquipment,
        // whatExtraEquipment: mechanicsDetails.whatExtraEquipment,
        comments: mechanicsDetails.comments,
        mechanicsPhotos: mechanicsDetails.mechanicsPhotos,
        mechanicsVideos: mechanicsDetails.mechanicsVideos,
        originalAuctionCarId: mechanicsDetails.originalAuctionCarId,
        // dashboardWarningLight: mechanicsDetails.dashboardWarningLight,
        // servicesDoneWithDates: mechanicsDetails.servicesDoneWithDates,
        // improvementOrModification: mechanicsDetails.improvementOrModification,
      });
    }
  });

  constructor() {
    this.mechanicsForm = this.#formBuilder.group({
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
      originalAuctionCarId: ['', [Validators.required]],
      // dashboardWarningLight: ['', [Validators.required]],
      // servicesDoneWithDates: ['', [Validators.required]],
      // improvementOrModification: ['', [Validators.required]],
    });
  }

  updateMechanicsDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.mechanicsForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionCarDetailsDataService.updateMechanicsDetails$(this.auctionCarId(), this.mechanicsForm).subscribe({
      next: () => {
        this.toastSuccess('Detalles mecánicos actualizados correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.mechanicsForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.mechanicsForm) return undefined;

    return this.#validatorsService.getError(this.mechanicsForm, field);
  }
}
