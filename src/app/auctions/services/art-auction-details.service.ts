import { environments } from '@env/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ArtAuctionDetails, SpecificArtAuction, SpecificArtAuctionDetailsLastChance } from '@auctions/interfaces';
import { ArtMetrics } from '@auctions/interfaces/art-metrics';

@Injectable({
  providedIn: 'root'
})
export class ArtAuctionDetailsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionDetails$(id: string): Observable<ArtAuctionDetails> {
    const url = `${this.#baseUrl}/auctions-cars/art/${id}`;

    return this.#http.get<ArtAuctionDetails>(url);
  }

  getSpecificAuctionDetails$(id: string): Observable<SpecificArtAuction> {
    const url = `${this.#baseUrl}/auctions-cars/auction-art/active/${id}`;

    return this.#http.get<SpecificArtAuction>(url);
  }

  getSpecificAuctionDetailsLastChance$(id: string): Observable<SpecificArtAuctionDetailsLastChance> {
    const url = `${this.#baseUrl}/auctions-cars/auction/last-chance-art/${id}`;

    return this.#http.get<SpecificArtAuctionDetailsLastChance>(url);
  }

  getArtMetrics$(id: string): Observable<ArtMetrics> {
    const url = `${this.#baseUrl}/auctions-cars/${id}/metrics-art`;

    return this.#http.get<ArtMetrics>(url);
  }
}
