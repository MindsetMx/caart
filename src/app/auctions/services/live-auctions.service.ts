import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { GetLiveCarAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class LiveAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuction$(auctionId: string): Observable<GetLiveCarAuction> {
    return this.#http.get<GetLiveCarAuction>(`${this.#baseUrl}/auctions-cars/auction/${auctionId}`);
  }
}
