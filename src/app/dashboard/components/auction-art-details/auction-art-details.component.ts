import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from '@app/app.service';
import { ArtWizard } from '@app/dashboard/interfaces';
import { UpdateAuctionArtDetailsService } from '@app/dashboard/services/update-auction-art-details.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';
import { bothOrNoneValidator } from '@shared/validations';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'auction-art-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
    MatAutocompleteModule,
    MatIcon,
  ],
  templateUrl: './auction-art-details.component.html',
  styleUrl: './auction-art-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtDetailsComponent {
  auctionArtId = input.required<string>();
  wizardData = input.required<ArtWizard>();

  #formBuilder = inject(FormBuilder);
  #sanitizer = inject(DomSanitizer);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);
  #updateAuctionArtDetailsService = inject(UpdateAuctionArtDetailsService);
  #changeDetectorRef = inject(ChangeDetectorRef);

  extraInfoForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  get certificadoAutenticidadControl(): FormControl {
    return this.extraInfoForm.get('certificadoAutenticidad') as FormControl;
  }

  get entidadCertificadoControl(): FormControl {
    return this.extraInfoForm.get('entidadCertificado') as FormControl;
  }

  get additionalChargesFormArray(): FormArray {
    return this.extraInfoForm.get('additionalCharges') as FormArray;
  }

  get additionalChargesFormArrayControls(): FormGroup[] {
    return this.additionalChargesFormArray.controls as FormGroup[];
  }

  constructor() {
    this.extraInfoForm = this.#formBuilder.group({
      // certificadoAutenticidad: ['', Validators.required],
      // entidadCertificado: ['', Validators.required],
      // entregaConMarco: ['', Validators.required],
      // firmaArtista: ['', Validators.required],
      // procedenciaObra: ['', Validators.required],
      // historiaArtista: [''],
      // photos: [[]],

      certificadoAutenticidad: ['', Validators.required],
      entidadCertificado: ['', Validators.required],
      entregaConMarco: ['', Validators.required],
      firmaArtista: ['', Validators.required],
      procedenciaObra: ['', Validators.required],
      historiaArtista: [''],
      photos: [[]],
      additionalCharges: this.#formBuilder.array([]),
      originalAuctionArtId: ['', Validators.required],
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
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.extraInfoForm.reset();
      this.additionalChargesFormArray.clear();

      const artDetails = this.wizardData().data.artDetails;
      this.extraInfoForm.patchValue({
        certificadoAutenticidad: artDetails.certificadoAutenticidad,
        entidadCertificado: artDetails.entidadCertificado,
        entregaConMarco: artDetails.entregaConMarco,
        firmaArtista: artDetails.firmaArtista,
        procedenciaObra: artDetails.procedenciaObra,
        historiaArtista: artDetails.historiaArtista,
        photos: artDetails.photos,
        originalAuctionArtId: this.auctionArtId(),
      });

      artDetails.additionalCharges.forEach((charge) => {
        const nuevoCredito = this.#formBuilder.group({
          chargeType: charge.chargeType,
          amount: charge.amount,
        }, { validators: bothOrNoneValidator() });

        this.additionalChargesFormArray.push(nuevoCredito);
      });

      this.#changeDetectorRef.detectChanges();
    }
  });

  updateArtDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.extraInfoForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionArtDetailsService.updateArtDetails$(this.auctionArtId(), this.extraInfoForm).subscribe({
      next: () => {
        this.#appService.toastSuccess('Detalles del arte actualizados exitosamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  addAdditionalCharge(): void {
    const nuevoCredito = this.#formBuilder.group({
      chargeType: [''],
      amount: [''],
    }, { validators: bothOrNoneValidator() });

    this.additionalChargesFormArray.push(nuevoCredito);
  }

  removeAdditionalCharge(index: number): void {
    this.additionalChargesFormArray.removeAt(index);
  }

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

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
