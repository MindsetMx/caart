import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BidArtConditions, BiddingArtConditions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiddingArtConditionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getBiddingConditions(auctionId: string): Observable<BiddingArtConditions> {
    return this.#http.get<BiddingArtConditions>(`${this.#baseUrl}/auctions-cars/${auctionId}/bidding-conditions-art`);
  }

  getBidConditions(auctionId: string, userBidAmount: number): Observable<BidArtConditions> {
    return this.#http.get<BidArtConditions>(`${this.#baseUrl}/auctions-cars/${auctionId}/bid-conditions-art?userBidAmount=${userBidAmount}`);
  }
}
