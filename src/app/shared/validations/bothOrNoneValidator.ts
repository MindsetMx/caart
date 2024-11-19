import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function bothOrNoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const chargeType = control.get('chargeType');
    const amount = control.get('amount');

    console.log({ chargeType, amount });

    if ((chargeType && chargeType.value) || (amount && amount.value !== null && amount.value !== undefined)) {
      if (!chargeType?.value ||
        (amount?.value === null ||
          amount?.value === undefined ||
          amount?.value === '')) {
        return { bothOrNone: true };
      }
    }
    return null;
  };
};
