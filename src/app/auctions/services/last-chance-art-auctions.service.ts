import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ArtAuctions } from '@auth/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastChanceArtAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  acceptOffer$(idLastChance: string, idOffer: string): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/art/${idLastChance}/accept-offer/${idOffer}`, {});
  }

  rejectBid$(auctionId: string, bidId: string): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/art/${auctionId}/reject-offer/${bidId}`, {});
  }
}
