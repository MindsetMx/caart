import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** A hero's name can't match the given regular expression */
export function onlyDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const onlyDigitsRegex = /^[0-9]*$/;
    const containsOnlyDigits = onlyDigitsRegex.test(control.value);
    return containsOnlyDigits ? null : { onlyDigits: { value: control.value } };
  };
}
