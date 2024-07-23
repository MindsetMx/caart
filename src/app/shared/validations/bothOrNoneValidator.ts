import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function bothOrNoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const chargeType = control.get('chargeType');
    const amount = control.get('amount');

    console.log({ chargeType, amount });


    if ((chargeType && chargeType.value) || (amount && amount.value)) {
      console.log('bothOrNone1');
      if (!chargeType?.value || !amount?.value) {
        console.log('bothOrNone2');

        return { bothOrNone: true };
      }
    }
    return null;
  };
};
