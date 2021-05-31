import { AbstractControl } from '@angular/forms';

interface IInvalidPassword {
  invalidPassword: boolean;
}

export function passwordValidator(control: AbstractControl): IInvalidPassword | null {
  if (
    control.value.trim() &&
    !(
      /[a-z]/.test(control.value) &&
      /[0-9]/.test(control.value) &&
      /[A-Z]/.test(control.value)
    )
  )
    return { invalidPassword: true };

  return null;
}
