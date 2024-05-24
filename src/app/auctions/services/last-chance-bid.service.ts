import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastChanceBidService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  addBid$(auctionId: string, bidAmount: number, paymentMethodId: string): Observable<any> {
    const url = `${this.#baseUrl}/last-chance-auctions/${auctionId}/add-bid`;

    return this.#http.post<any>(url, { bidAmount, paymentIntentId: paymentMethodId });
  }

  getBiddingConditions$(auctionId: string): Observable<any> {
    const url = `${this.#baseUrl}/last-chance-auctions/${auctionId}/bidding-conditions`;

    return this.#http.get<any>(url);
  }

  getBidConditions$(auctionId: string, userBidAmount: number): Observable<any> {
    const url = `${this.#baseUrl}/last-chance-auctions/${auctionId}/bid-conditions?userBidAmount=${userBidAmount}`;

    return this.#http.get<any>(url);
  }
}
