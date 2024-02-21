import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BidConditions, BiddingConditions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiddingConditionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getBiddingConditions(auctionId: string): Observable<BiddingConditions> {
    return this.#http.get<BiddingConditions>(`${this.#baseUrl}/auctions-cars/${auctionId}/bidding-conditions`);
  }

  getBidConditions(auctionId: string, userBidAmount: number): Observable<BidConditions> {
    return this.#http.get<BidConditions>(`${this.#baseUrl}/auctions-cars/${auctionId}/bid-conditions?userBidAmount=${userBidAmount}`);
  }
}
