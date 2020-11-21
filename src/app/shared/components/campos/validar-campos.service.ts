import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

//injetado no root qualquer local do sistema tera acesso
@Injectable({
  providedIn: 'root'
})
export class ValidarCamposService {

  constructor() { }

  hasErrorValidar(control: AbstractControl, errorName: string):boolean {
    if ((control.dirty || control.touched) && this.hasError(control, errorName)) {
      return true;
    }
    return false;
  }

//control e os campos formulario, retorna boolean, o AbstractControl possui haserror
  hasError(control: AbstractControl, errorName: string):boolean {
    return control.hasError(errorName);
  }

  //especificar tipo de erro, mensagem erro
  lenghtValidar(control: AbstractControl, errorName: string):number {
    const error = control.errors[errorName];
    return error.requireLenght || error.min || error.max
  }
}
