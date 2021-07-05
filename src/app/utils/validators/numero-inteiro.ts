import { AbstractControl } from '@angular/forms';

interface INumeroInteiro {
  inteiro: boolean;
}

export function isNumberIntegerValidator(control: AbstractControl): INumeroInteiro | null {
  if (control.value && !Number.isInteger(control.value))
    return { inteiro: true };
  return null;
}
