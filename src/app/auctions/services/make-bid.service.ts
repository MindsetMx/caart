import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class MakeBidService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  makeBid$(auctionId: string, bidAmount: number, paymentMethodId: string): Observable<any> {
    const url = `${this.#baseUrl}/auctions-cars/${auctionId}/bid`;

    return this.#http.post<any>(url, { bidAmount, paymentMethodId });
  }

  makeMemorabiliaBid$(auctionId: string, bidAmount: number, paymentMethodId: string): Observable<any> {
    const url = `${this.#baseUrl}/auctions-memorabilia/${auctionId}/bid`;

    return this.#http.post<any>(url, { bidAmount, paymentMethodId });
  }
}
