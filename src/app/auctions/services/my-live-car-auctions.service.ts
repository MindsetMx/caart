import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLiveCarAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  updateCarAuctionReservePrice$(auctionId: string, reserveAmount: number): Observable<void> {
    const url = `${this.#baseUrl}/auctions-cars/${auctionId}/update-reserve`;

    return this.#http.patch<void>(url, { reserveAmount });
  }
}
