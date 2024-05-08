import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuctionDetails, AuctionMemorabiliaMetrics, AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { AuctionMemorabiliaDetails } from '@auctions/interfaces/auction-memorabilia-details';
import { SpecificMemorabiliaAuction } from '@auctions/interfaces/specific-memorabilia-auction';
import { ArtMetrics } from '@auctions/interfaces/art-metrics';

@Injectable({
  providedIn: 'root'
})
export class AuctionDetailsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionDetails$(id: string): Observable<AuctionDetails> {
    const url = `${this.#baseUrl}/auctions-cars/${id}`;

    return this.#http.get<AuctionDetails>(url);
  }

  getSpecificAuctionDetails$(id: string): Observable<SpecificAuction> {
    const url = `${this.#baseUrl}/auctions-cars/auction/${id}`;

    return this.#http.get<SpecificAuction>(url);
  }

  getMetrics$(id: string): Observable<AuctionMetrics> {
    const url = `${this.#baseUrl}/auctions-cars/${id}/metrics`;

    return this.#http.get<AuctionMetrics>(url);
  }

  getMemorabiliaAuctionDetails$(id: string): Observable<AuctionMemorabiliaDetails> {
    const url = `${this.#baseUrl}/auctions-memorabilia/${id}`;

    return this.#http.get<AuctionMemorabiliaDetails>(url);
  }

  getSpecificMemorabiliaAuctionDetails$(id: string): Observable<SpecificMemorabiliaAuction> {
    const url = `${this.#baseUrl}/auctions-memorabilia/auction/${id}`;

    return this.#http.get<SpecificMemorabiliaAuction>(url);
  }

  getMemorabiliaMetrics$(id: string): Observable<AuctionMemorabiliaMetrics> {
    const url = `${this.#baseUrl}/auctions-memorabilia/${id}/metrics`;

    return this.#http.get<AuctionMemorabiliaMetrics>(url);
  }

  getArtMetrics$(id: string): Observable<ArtMetrics> {
    const url = `${this.#baseUrl}/auctions-cars/${id}/metrics-art`;

    return this.#http.get<ArtMetrics>(url);
  }
}
