import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VALIDATION_MESSAGES } from '@shared/validation-messages';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  #toastr = inject(ToastrService);

  toastOptions: Partial<IndividualConfig> = {
    closeButton: true, // Mostrar botón de cierre
    progressBar: true, // Mostrar barra de progreso
    timeOut: 3000, // Duración del mensaje
  };

  toastSuccess(message: string, titulo?: string, toastOptions: Partial<IndividualConfig> = this.toastOptions): void {
    this.#toastr.success(message, titulo, toastOptions);
  }

  toastError(message: string, titulo?: string | undefined, toastOptions: Partial<IndividualConfig> = this.toastOptions): void {
    this.#toastr.error(message, titulo, toastOptions);
  }

  trimObjectValues(obj: any, passwordFields: string[] = []): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.trimObjectValues(item, passwordFields));
    } else if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (passwordFields.includes(key)) {
            result[key] = obj[key];
          } else {
            result[key] = this.trimObjectValues(obj[key], passwordFields);
          }
        }
      }
      return result;
    } else if (typeof obj === 'string') {
      return obj.trim();
    } else {
      return obj;
    }
  }
}
