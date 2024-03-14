import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BidMemorabiliaConditions, BiddingMemorabiliaConditions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiddingMemorabiliaConditionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getBiddingConditions(auctionId: string): Observable<BiddingMemorabiliaConditions> {
    return this.#http.get<BiddingMemorabiliaConditions>(`${this.#baseUrl}/auctions-memorabilia/${auctionId}/bidding-conditions`);
  }

  getBidConditions(auctionId: string, userBidAmount: number): Observable<BidMemorabiliaConditions> {
    return this.#http.get<BidMemorabiliaConditions>(`${this.#baseUrl}/auctions-memorabilia/${auctionId}/bid-conditions?userBidAmount=${userBidAmount}`);
  }
}
