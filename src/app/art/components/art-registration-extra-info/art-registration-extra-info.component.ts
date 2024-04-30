import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompleteArtRegistrationService } from '@app/art/services/complete-art-registration.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AutoResizeTextareaDirective, InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

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

  extraInfoForm: FormGroup;

  isButtonSubmitDisabled = signal<boolean>(false);


  // originalAuctionCarIdChangedEffect = effect(() => {
  //   this.getExtraInfo();
  // });

  constructor() {
    this.extraInfoForm = this.#fb.group({
      certificadoAutenticidad: ['', Validators.required],
      entregaConMarco: ['', Validators.required],
      firmaArtista: ['', Validators.required],
      procedenciaObra: ['', Validators.required],
      historiaArtista: ['', Validators.required],
      originalAuctionArtId: [this.originalAuctionArtId, Validators.required],
    });
  }

  get originalAuctionArtId(): string {
    return this.#completeArtRegistrationService.originalAuctionArtId();
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
