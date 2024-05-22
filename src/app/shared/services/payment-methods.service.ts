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

  // http://localhost:3000/users/payment-methods/pm_1P355DERAnFdCDEdwKSYw7bw
  deletePaymentMethod$(paymentMethodId: string): Observable<any> {
    const url = `${this.#baseUrl}/users/payment-methods/${paymentMethodId}`;

    return this.#http.delete<any>(url);
  }

  getPaymentMethods$(): Observable<PaymentMethods> {
    const url = `${this.#baseUrl}/users/payment-methods`;

    return this.#http.get<PaymentMethods>(url);
  }

  setDefaultPaymentMethod$(paymentMethodId: string): Observable<any> {
    const url = `${this.#baseUrl}/users/set-default-payment-method`;

    return this.#http.patch<any>(url, { paymentMethodId });
  }
}
