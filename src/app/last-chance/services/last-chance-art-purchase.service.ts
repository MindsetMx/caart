import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastChanceArtPurchaseService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getConditions(auctionId: string): Observable<any> {
    // return this.#http.get<any>(`${this.#baseUrl}/last-chance-auctions/get-conditions/${auctionId}`);
    // get-conditions-art/:id'
    return this.#http.get<any>(`${this.#baseUrl}/last-chance-auctions/get-conditions-art/${auctionId}`);
  }

  purchase$(purchaseForm: FormGroup): Observable<void> {
    const { reserveAmount, paymentMethodId } = purchaseForm.value;

    return this.#http.post<void>(`${this.#baseUrl}/last-chance-auctions/${purchaseForm.value.auctionId}/purchase-art`, {
      reserveAmount,
      paymentMethodId,
    });
  }
}
