import { environments } from '@env/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LastChanceCarPurchaseConditions } from '@auctions/interfaces';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LastChancePurchaseService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getConditions(auctionId: string): Observable<LastChanceCarPurchaseConditions> {
    return this.#http.get<LastChanceCarPurchaseConditions>(`${this.#baseUrl}/last-chance-auctions/get-conditions/${auctionId}`);
  }

  purchase$(purchaseForm: FormGroup): Observable<void> {
    const { reserveAmount, paymentMethodId } = purchaseForm.value;

    return this.#http.post<void>(`${this.#baseUrl}/last-chance-auctions/${purchaseForm.value.auctionId}/purchase`, {
      reserveAmount,
      paymentMethodId,
    });
  }
}
