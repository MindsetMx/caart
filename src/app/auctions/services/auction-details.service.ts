import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuctionDetails, SpecificAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';

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
}
