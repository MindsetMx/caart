import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { GetLiveArtAuction, GetLiveCarAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class LiveAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getCarAuction$(auctionId: string): Observable<GetLiveCarAuction> {
    // return this.#http.get<GetLiveCarAuction>(`${this.#baseUrl}/auctions-cars/auction/${auctionId}`);
    // auctions-cars/single-auction/:auctionId
    return this.#http.get<GetLiveCarAuction>(`${this.#baseUrl}/auctions-cars/single-auction/${auctionId}`);
  }

  getArtAuction$(auctionId: string): Observable<GetLiveArtAuction> {
    // return this.#http.get<any>(`${this.#baseUrl}/auctions-cars/auction-art/${auctionId}`);
    // auctions-cars/single-auction-art/:auctionId
    return this.#http.get<GetLiveArtAuction>(`${this.#baseUrl}/auctions-cars/single-auction-art/${auctionId}`);
  }
}
