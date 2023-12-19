import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';

import { VALIDATION_MESSAGES } from '@shared/validation-messages';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  addServerErrorsToForm(formGroup: FormGroup, fieldName: string, errorMessage: string): void {
    // Añadir el error al array de errores del campo correspondiente
    this.addErrorToValidationMessages(fieldName, errorMessage);
    // Añadir el error al FormGroup
    this.addErrorToFormGroup(formGroup, fieldName);

    formGroup.markAllAsTouched();
  }

  addErrorToValidationMessages(fieldName: string, errorMessage: string): void {
    VALIDATION_MESSAGES[fieldName] = (): string => errorMessage;
  }

  addErrorToFormGroup(formGroup: FormGroup, fieldName: string): void {
    const errors: any = {};
    errors[fieldName] = true;

    formGroup.get(fieldName)?.setErrors(errors);
  }

  hasError(form: FormGroup, field: string): boolean {
    return form.controls[field].touched && form.controls[field].errors !== null;
  }

  formArrayHasError(formArray: FormArray, index: number): boolean {
    return formArray.controls[index].invalid && formArray.controls[index].touched;
  }

  formHasError(form: FormGroup): boolean {
    return form.invalid && form.touched;
  }

  isValidForm(formGroup: FormGroup): boolean {
    if (formGroup.invalid) {
      formGroup.markAllAsTouched();
      return false;
    }

    return true;
  }

  getControlErrors(form: FormGroup, field: string): ValidationErrors | null {
    return form.controls[field]?.errors || null;
  }

  getError(form: FormGroup, field: string): string | undefined {
    const errors = this.getControlErrors(form, field);

    if (!errors) {
      return undefined;
    }

    const errorKey = Object.keys(errors).find(key => VALIDATION_MESSAGES[key]?.(errors[key]));

    return errorKey && VALIDATION_MESSAGES[errorKey]?.(errors[errorKey]);
  }

  getErrorFromFormArray(form: FormArray, index: number): string | undefined {
    const errors = form.controls[index]?.errors;

    if (!errors) {
      return undefined;
    }

    const errorKey = Object.keys(errors).find(key => VALIDATION_MESSAGES[key]?.(errors[key]));

    return errorKey && VALIDATION_MESSAGES[errorKey]?.(errors[errorKey]);
  }

  getFirstInvalidControl(form: FormGroup): AbstractControl | null {
    const controlName = Object.keys(form.controls).find(controlName => {
      const control = form.get(controlName);
      return control?.invalid && control.touched;
    });

    return controlName ? form.get(controlName) : null;
  }

  getFirstErrorMessage(control: AbstractControl | null): string | undefined {
    if (!control || !control.errors) {
      return undefined;
    }

    const errorKey = Object.keys(control.errors).find(key => {
      if (!control || !control.errors) return false;

      return VALIDATION_MESSAGES[key]?.(control.errors[key])
    });

    return errorKey && VALIDATION_MESSAGES[errorKey]?.(control.errors[errorKey]);
  }

  getFirstError(form: FormGroup): string | undefined {
    const control = this.getFirstInvalidControl(form);
    return this.getFirstErrorMessage(control);
  }

  //custom validator
  public samePasswords(pass1: string, pass2: string) {
    return (control: AbstractControl<any, any>): ValidationErrors | null => {
      const password = control.get(pass1)?.value;
      const password2 = control.get(pass2)?.value;

      if (password !== password2) {
        control.get(pass2)?.setErrors({ notEqual: true });
        return { notEqual: true };
      }

      control.get(pass2)?.setErrors(null);
      return null;
    }
  }
}
