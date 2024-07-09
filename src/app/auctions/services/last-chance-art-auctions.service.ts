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
    // http://localhost:3000/last-chance-auctions/art/668c6140d4f3d8d4cd4e027b/accept-offer/668c6149d4f3d8d4cd4e0307
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/art/${idLastChance}/accept-offer/${idOffer}`, {});
  }

  rejectBid$(auctionId: string, bidId: string): Observable<any> {
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/art/${auctionId}/reject-offer/${bidId}`, {});
  }
}
