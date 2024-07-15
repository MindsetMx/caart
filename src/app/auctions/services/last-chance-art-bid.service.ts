import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetArtBiddingConditions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastChanceArtBidService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  addBid$(auctionId: string, bidAmount: number, paymentMethodId: string): Observable<any> {
    // const url = `${this.#baseUrl}/last-chance-auctions/${auctionId}/add-bid`;
    // art/:id/add-bid
    const url = `${this.#baseUrl}/last-chance-auctions/art/${auctionId}/add-bid`;

    return this.#http.post<any>(url, { bidAmount, paymentIntentId: paymentMethodId });
  }

  getBiddingConditions$(auctionId: string): Observable<GetArtBiddingConditions> {
    // const url = `${this.#baseUrl}/last-chance-auctions/${auctionId}/bidding-conditions`;
    // art/:id/bidding-conditions
    const url = `${this.#baseUrl}/last-chance-auctions/art/${auctionId}/bidding-conditions`;

    return this.#http.get<GetArtBiddingConditions>(url);
  }

  getBidConditions$(auctionId: string, userBidAmount: number): Observable<any> {
    // const url = `${this.#baseUrl}/last-chance-auctions/${auctionId}/bid-conditions?userBidAmount=${userBidAmount}`;
    // art/:id/bid-conditions
    const url = `${this.#baseUrl}/last-chance-auctions/art/${auctionId}/bid-conditions?userBidAmount=${userBidAmount}`;

    return this.#http.get<any>(url);
  }
}
