import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuctionDetails, AuctionMemorabiliaMetrics, AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { AuctionMemorabiliaDetails } from '@auctions/interfaces/auction-memorabilia-details';
import { SpecificMemorabiliaAuction } from '@auctions/interfaces/specific-memorabilia-auction';
import { ArtMetrics } from '@auctions/interfaces/art-metrics';
import { SpecificCarAuctionDetailsLastChance } from '@auctions/interfaces/specific-car-auction-details-last-chance';
import { GetBids } from '@auctions/interfaces/get-bids';

@Injectable({
  providedIn: 'root'
})
export class AuctionDetailsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionDetails$(id: string): Observable<AuctionDetails> {
    const url = `${this.#baseUrl}/auctions-cars/live-auction/${id}`;

    return this.#http.get<AuctionDetails>(url);
  }

  getSpecificAuctionDetails$(id: string): Observable<SpecificAuction> {
    const url = `${this.#baseUrl}/auctions-cars/auction/active/${id}`;

    return this.#http.get<SpecificAuction>(url);
  }

  getSpecificAuctionDetailsLastChance$(id: string): Observable<SpecificCarAuctionDetailsLastChance> {
    const url = `${this.#baseUrl}/auctions-cars/auction/last-chance/${id}`;

    return this.#http.get<SpecificCarAuctionDetailsLastChance>(url);
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

  // /auctions-cars/auction/active/panel-bids/66abe397253f62c7e0df7284?page=1&size=2
  getPanelBids$(id: string, page: number, size: number): Observable<GetBids> {
    const url = `${this.#baseUrl}/auctions-cars/auction/active/panel-bids/${id}?page=${page}&size=${size}`;

    return this.#http.get<GetBids>(url);
  }

  // http://localhost:3000/auctions-cars/can-enter/?type=art&id=66d1fba6db52cf95a07b1a17
  canEnterAuction$(type: string, id: string): Observable<boolean> {
    const url = `${this.#baseUrl}/auctions-cars/can-enter/?type=${type}&id=${id}`;

    return this.#http.get<boolean>(url);
  }
}
