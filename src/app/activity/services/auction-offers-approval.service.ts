import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ArtAuctionOffersApproval, CarAuctionOffersApproval } from '@activity/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuctionOffersApprovalService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // http://localhost:3000/last-chance-auctions/last-chance-auction-bids/667ca8cd88de39287a176bad
  getCarAuctionOffersApproval$(auctionId: string): Observable<CarAuctionOffersApproval> {
    return this.#http.get<CarAuctionOffersApproval>(`${this.#baseUrl}/last-chance-auctions/last-chance-auction-bids/${auctionId}`);
  }

  // http://localhost:3000/last-chance-auctions/last-chance-auction-art-bids/667ca8cd88de39287a176bad
  getArtAuctionOffersApproval$(auctionId: string): Observable<ArtAuctionOffersApproval> {
    return this.#http.get<ArtAuctionOffersApproval>(`${this.#baseUrl}/last-chance-auctions/last-chance-auction-art-bids/${auctionId}`);
  }
}
