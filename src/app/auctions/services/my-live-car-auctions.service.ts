import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MyLiveCarAuctions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLiveCarAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getMyLiveCarAuctions$(): Observable<MyLiveCarAuctions> {
    const url = `${this.#baseUrl}/auctions-cars/my-live-auctions`;

    return this.#http.get<MyLiveCarAuctions>(url);
  }

  updateCarAuctionReservePrice$(auctionId: string, reserveAmount: number): Observable<void> {
    const url = `${this.#baseUrl}/auctions-cars/${auctionId}/update-reserve`;

    return this.#http.patch<void>(url, { reserveAmount });
  }
}
