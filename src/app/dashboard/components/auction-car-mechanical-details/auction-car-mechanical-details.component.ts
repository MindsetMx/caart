import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '@shared/services/validators.service';
import { UpdateAuctionCarDetailsDataService } from '@dashboard/services/update-auction-car-details-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Fancybox } from '@fancyapps/ui';
import { AppService } from '@app/app.service';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';

@Component({
  selector: 'auction-car-mechanical-details',
  templateUrl: './auction-car-mechanical-details.component.html',
  styleUrls: ['./auction-car-mechanical-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
  ]
})
export class AuctionCarMechanicalDetailsComponent {
  wizardData = input.required<WizardData>();
  auctionCarId = input.required<string>();

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #domSanitizer = inject(DomSanitizer);
  #appService = inject(AppService);

  mechanicsForm: FormGroup;
  isButtonSubmitDisabled = signal<boolean>(false);

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.mechanicsForm.reset();

      const mechanicsDetails = this.wizardData().data.mechanicsDetails;
      this.mechanicsForm.patchValue({
        comments: mechanicsDetails.comments,
        mechanicsPhotos: mechanicsDetails.mechanicsPhotos,
        mechanicsVideos: mechanicsDetails.mechanicsVideos,
        spareTire: mechanicsDetails.spareTire,
        tireBrand: mechanicsDetails.tireBrand,
        tireSize: mechanicsDetails.tireSize,
        originalAuctionCarId: mechanicsDetails.originalAuctionCarId,
      });
    }
  });

  constructor() {
    this.mechanicsForm = this.#formBuilder.group({
      comments: ['', [Validators.required]],
      mechanicsPhotos: [[], [Validators.required]],
      mechanicsVideos: [[]],
      spareTire: [false, [Validators.required]],
      tireBrand: [''],
      tireSize: [''],
      originalAuctionCarId: ['', [Validators.required]],
    });

    Fancybox.bind("[data-fancybox='mechanicsPhotosGallery']", { Hash: false });
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
      error: (error: any) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  hasError(fieldName: string): boolean {
    const control = this.mechanicsForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getError(fieldName: string): string {
    const control = this.mechanicsForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['requiredTrue']) return 'Debes aceptar los términos y condiciones';
    
    return 'Campo inválido';
  }

  getSafeUrl(url: string): any {
    return this.#domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
