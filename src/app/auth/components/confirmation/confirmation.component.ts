import { ChangeDetectionStrategy, Component, WritableSignal, signal, inject, ElementRef, HostListener, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AppService } from '@app/app.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { VerificationService } from '@auth/services/verification.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    RouterModule,
    ReactiveFormsModule,
    InputErrorComponent,
    CommonModule,
    SpinnerComponent
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  @ViewChildren('digitInputs') digitInputs?: QueryList<ElementRef>;

  #appService = inject(AppService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);
  #verificationService = inject(VerificationService);

  codeForm: FormGroup;
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  editableIndex: WritableSignal<number> = signal(0);

  constructor() {
    this.codeForm = this.#fb.group({
      digits: this.#fb.array([
        this.#fb.control('', Validators.required),
        this.#fb.control('', Validators.required),
        this.#fb.control('', Validators.required),
        this.#fb.control('', Validators.required),
        this.#fb.control('', Validators.required),
        this.#fb.control('', Validators.required),
      ])
    });
  }

  get digitsArray(): FormArray {
    return this.codeForm.get('digits') as FormArray;
  }

  resendCodeToEmail(): void {
    this.#verificationService.resendCodeToEmail$().subscribe({
      next: () => {
        this.toastSuccess('El código de verificación ha sido enviado a tu correo');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.error);
      }
    });
  }

  resendCode(): void {
    this.#verificationService.resendCode$().subscribe({
      next: () => {
        this.toastSuccess('El código de verificación ha sido enviado vía WhatsApp');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.error);
      }
    });
  }

  confirm(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.digitsArray);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    const code = this.digitsArray.controls.map(control => control.value).join('');

    this.#verificationService.confirmAccount$(code).subscribe({
      next: () => {
        this.toastSuccess('Tu cuenta ha sido verificada');
        this.#router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);

        this.#validatorsService.addServerErrorsToFormArray(this.digitsArray, error.error.error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  handleClick(index: number) {
    if (index !== this.editableIndex() && this.digitInputs) {
      const editableInput = this.digitInputs.toArray()[this.editableIndex()];

      if (editableInput) {
        editableInput.nativeElement.focus();
      }
    }
  }


  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement) {
    if (target.value) {
      if (isNaN(Number(target.value))) {
        target.value = '';
        return;
      }

      const currentControlIndex = this.digitInputs?.toArray().findIndex(input => input.nativeElement === target);

      if (currentControlIndex !== undefined && currentControlIndex < this.digitsArray.length - 1) {
        const nextInput = this.digitInputs?.toArray()[currentControlIndex + 1].nativeElement;
        if (nextInput) {
          this.editableIndex.set(currentControlIndex + 1);

          nextInput.focus();
        }
      }

      if (currentControlIndex === this.digitsArray.length - 1) {
        this.confirm();
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLInputElement;

    if (event.key === 'Backspace' && activeElement) {
      const currentValue = activeElement.value;

      if (!currentValue) {
        const currentControlIndex = this.digitInputs?.toArray().findIndex(input => input.nativeElement === activeElement);

        if (currentControlIndex !== undefined && currentControlIndex > 0) {
          const previousInput = this.digitInputs?.toArray()[currentControlIndex - 1].nativeElement;
          if (previousInput) {
            this.editableIndex.set(currentControlIndex - 1);

            previousInput.focus();
          }
        }
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text/plain');
    if (clipboardData) {
      this.handlePaste(clipboardData);
    }
  }

  private handlePaste(pastedData: string) {
    //limpiar el input
    this.digitsArray.controls.forEach(control => control.setValue(''));

    const digitsArray = this.getOnlyNumberOfText(pastedData).split('', 6);

    digitsArray.forEach((digit, index) => {
      const control = this.digitsArray.at(index);

      if (control) {
        control.setValue(digit);
      }
    });

    //poner el foco en el siguiente input de digitsArray.length si no esta en el ultimo
    if (digitsArray.length < this.digitsArray.length) {
      const nextInput = this.digitInputs?.toArray()[digitsArray.length].nativeElement;
      if (nextInput) {
        this.editableIndex.set(digitsArray.length);

        nextInput.focus();
      }
    } else {
      const lastInput = this.digitInputs?.toArray()[digitsArray.length - 1].nativeElement;
      if (lastInput) {
        this.editableIndex.set(digitsArray.length - 1);

        lastInput.focus();

        this.confirm();
      }
    }
  }

  private getOnlyNumberOfText(text: string): string {
    // Usa una expresión regular para eliminar todo lo que no sea un dígito
    const digitRegex = /[0-9]/g;
    return text.match(digitRegex)?.join('') || '';
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }

  formHasError(): boolean {
    return this.#validatorsService.formHasError(this.digitsArray);
  }

  getFirstError(): string | undefined {
    return this.#validatorsService.getFirstError(this.digitsArray);
  }
}
