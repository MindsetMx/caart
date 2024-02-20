import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, WritableSignal, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { idTypes } from '@auth/enums';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'complete-register',
  standalone: true,
  imports: [
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent
  ],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegisterComponent implements OnInit, OnDestroy {
  @Input() mb: string = 'mb-32';
  publicationId = input.required<string>();

  @Output() completeRegisterModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  #appService = inject(AppService);
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImages: WritableSignal<string[]> = signal(['', '']);
  completeRegisterForm: FormGroup;

  validationTypeSubscription?: Subscription;

  constructor() {
    this.completeRegisterForm = this.#fb.group({
      taxId: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      streetAndNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      validationType: [idTypes.ine, [Validators.required]],
      validationImg: this.#fb.array([
        ['', [Validators.required]],
        ['', [Validators.required]]
      ]),
    });
  }

  get idTypes(): typeof idTypes {
    return idTypes;
  }

  get validationType(): FormControl {
    return this.completeRegisterForm.get('validationType') as FormControl;
  }

  get validationImgFormArray(): FormArray {
    return this.completeRegisterForm.get('validationImg') as FormArray;
  }

  ngOnInit(): void {
    this.validationTypeSubscription = this.validationType.valueChanges.subscribe((value) => {
      this.setValidationType(value);
    });
  }

  ngOnDestroy(): void {
    if (this.validationTypeSubscription)
      this.validationTypeSubscription.unsubscribe();
  }

  completeRegister(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.completeRegisterForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#authService.completeRegister$(this.completeRegisterForm).subscribe({
      next: () => {
        this.toastSuccess('Registro completado con éxito');

        this.completeRegisterForm.reset();

        this.#router.navigate(['/completar-registro-vehiculo', this.publicationId()]);

        this.completeRegisterModalIsOpenChange.emit(false);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  setValidationType(type: idTypes): void {
    switch (type) {
      case idTypes.ine:
        this.completeRegisterForm?.setControl('validationImg', new FormArray([
          new FormControl(null, Validators.required),
          new FormControl(null, Validators.required),
        ]));

        break;
      case idTypes.passport:
        this.completeRegisterForm?.setControl('validationImg', new FormArray([
          new FormControl(null, Validators.required),
        ]));

        break;
    }
  }

  selectFile(event: Event, indice: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files?.length) return;

    const file = inputElement.files[0];
    this.validationImgFormArray.at(indice).setValue(file);

    this.showPreview(file, indice);
  }

  showPreview(archivo: File, indice: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages.set(
        this.previewImages().map((image, index) => {
          if (index === indice) return reader.result as string;
          return image;
        })
      );
    }
    reader.readAsDataURL(archivo);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.completeRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.completeRegisterForm) return undefined;

    return this.#validatorsService.getError(this.completeRegisterForm, field);
  }

  formArrayHasError(index: number): boolean {
    if (!this.completeRegisterForm) return false;

    return this.#validatorsService.formArrayHasError(this.validationImgFormArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    if (!this.completeRegisterForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(this.validationImgFormArray, index);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
