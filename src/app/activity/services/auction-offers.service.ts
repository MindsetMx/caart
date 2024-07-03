import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { ArtAuctionOffers, CarAuctionOffers } from '@activity/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuctionOffersService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // http://localhost:3000/auctions-cars/active-auction-bids/{{originalAuctionCar}}
  getCarAuctionOffers$(auctionId: string): Observable<CarAuctionOffers> {
    return this.#http.get<CarAuctionOffers>(`${this.#baseUrl}/auctions-cars/active-auction-bids/${auctionId}`);
  }

  // http://localhost:3000/auctions-cars/active-auction-art-bids/{{originalAuctionCar}}
  getArtAuctionOffers$(auctionId: string): Observable<ArtAuctionOffers> {
    return this.#http.get<ArtAuctionOffers>(`${this.#baseUrl}/auctions-cars/active-auction-art-bids/${auctionId}`);
  }
}
