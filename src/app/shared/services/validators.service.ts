import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';

import { VALIDATION_MESSAGES } from '@shared/validation-messages';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  public hasError(form: FormGroup, field: string): boolean {
    return form.controls[field].touched && form.controls[field].errors !== null;
  }

  public isValidForm(formGroup: FormGroup): boolean {
    if (formGroup.invalid) {
      formGroup.markAllAsTouched();
      return false;
    }

    return true;
  }

  public getControlErrors(form: FormGroup, field: string): ValidationErrors | null {
    return form.controls[field]?.errors || null;
  }

  public getFieldError(form: FormGroup, field: string): string | undefined {
    const errors = this.getControlErrors(form, field); //Se obtienen los errores del campo
    if (!errors) return undefined; //Si no hay errores, se retorna null

    return Object.keys(errors) //Se obtienen las keys de los errores
      .map(key => VALIDATION_MESSAGES[key]?.(errors[key])) //Se obtiene el mensaje de error de cada key
      .find(errorMessage => !!errorMessage) || undefined; //Se retorna el primer mensaje de error que no sea undefined
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
