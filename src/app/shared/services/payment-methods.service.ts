import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { PaymentMethods } from '@app/register-car/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getPaymentMethods$(): Observable<PaymentMethods> {
    const url = `${this.#baseUrl}/users/payment-methods`;

    return this.#http.get<any>(url);
  }
}
