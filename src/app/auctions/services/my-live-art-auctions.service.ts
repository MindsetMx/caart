import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MyLiveArtAuctions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyLiveArtAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getMyLiveArtAuctions$(): Observable<MyLiveArtAuctions> {
    const url = `${this.#baseUrl}/auctions-cars/my-live-auctions-art`;

    return this.#http.get<MyLiveArtAuctions>(url);
  }

  updateArtAuctionReservePrice$(auctionId: string, reserveAmount: number): Observable<void> {
    const url = `${this.#baseUrl}/auctions-cars/${auctionId}/update-reserve-art`;

    return this.#http.patch<void>(url, { reserveAmount });
  }
}
