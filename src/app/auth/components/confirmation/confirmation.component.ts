import { ChangeDetectionStrategy, Component, WritableSignal, signal, inject, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    RouterModule,
    ReactiveFormsModule,
    InputErrorComponent,
    CommonModule
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  #el = inject(ElementRef);
  #fb = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);

  codeForm: FormGroup;
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);

  constructor() {
    this.codeForm = this.#fb.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
    });
  }

  confirm(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.codeForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement) {
    if (target.value && isNaN(Number(target.value))) {
      target.value = '';
    }

    if (target.value) {
      const digitControls = Object.keys(this.codeForm.controls);
      const currentControlIndex = digitControls.findIndex((controlName) =>
        target === this.#el.nativeElement.querySelector(`[formControlName="${controlName}"]`)
      );

      if (currentControlIndex < Object.keys(this.codeForm.controls).length - 1) {
        const nextControlName = digitControls[currentControlIndex + 1];
        const nextControl = this.codeForm.get(nextControlName);

        if (nextControl) {
          nextControl.markAsTouched();
          const nextInput = this.#el.nativeElement.querySelector(`[formControlName="${nextControlName}"]`);

          if (nextInput) {
            nextInput.focus();
          }
        }
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLInputElement;

    if (event.key === 'Backspace' && activeElement) {
      const currentValue = activeElement.value;

      if (!currentValue) {
        const digitControls = Object.keys(this.codeForm.controls);
        const currentControlIndex = digitControls.findIndex(
          (controlName) => activeElement === this.#el.nativeElement.querySelector(`[formControlName="${controlName}"]`)
        );

        if (currentControlIndex > 0) {
          const previousControlName = digitControls[currentControlIndex - 1];
          const previousControl = this.codeForm.get(previousControlName);

          if (previousControl) {
            previousControl.setValue('');
            const previousInput = this.#el.nativeElement.querySelector(`[formControlName="${previousControlName}"]`);

            if (previousInput) {
              previousInput.focus();
            }
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
    const digitsArray = this.getOnlyNumberOfText(pastedData).split('', 6);
    const digitControls = Object.keys(this.codeForm.controls);

    digitsArray.forEach((digit, index) => {
      const controlName = digitControls[index];
      const control = this.codeForm.get(controlName);

      if (control) {
        control.setValue(this.getOnlyNumberOfText(digit));
      }
    });
  }

  private getOnlyNumberOfText(text: string): string {
    // Usa una expresión regular para eliminar todo lo que no sea un dígito
    const digitRegex = /[0-9]/g;
    return text.match(digitRegex)?.join('') || '';
  }

  formHasError(): boolean {
    return this.#validatorsService.formHasError(this.codeForm);
  }

  getFirstError(): string | undefined {
    return this.#validatorsService.getFirstError(this.codeForm);
  }
}
