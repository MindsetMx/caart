import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LastChanceCarAuctions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastChanceCarAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  acceptOffer$(idLastChance: string, idOffer: string): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/${idLastChance}/accept-offer/${idOffer}`, {});
  }

  rejectBid$(auctionId: string, bidId: string): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/${auctionId}/reject-offer/${bidId}`, {});
  }
}
