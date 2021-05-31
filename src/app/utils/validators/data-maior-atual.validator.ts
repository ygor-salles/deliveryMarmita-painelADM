import { AbstractControl } from '@angular/forms';

interface DataMaiorQueAtual {
    isDataMaior: boolean;
}

export function isDataMaiorQueAtual(control: AbstractControl): DataMaiorQueAtual | null {
    if(control.value >= new Date()) return { isDataMaior: true };
    return null;
}
