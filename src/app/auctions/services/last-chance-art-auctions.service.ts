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

  getMyAuctions$(): Observable<ArtAuctions> {
    // /my-auctions-art
    return this.#http.get<ArtAuctions>(`${this.#baseUrl}/last-chance-auctions/my-auctions-art`);
  }

  acceptOffer$(idLastChance: string, idOffer: string): Observable<any> {
    // return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/${idLastChance}/accept-offer/${idOffer}`, {});
    // art/:auctionId/accept-offer/:bidId
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/art/${idLastChance}/accept-offer/${idOffer}`, {});
  }


  rejectBid$(auctionId: string, bidId: string): Observable<any> {
    // return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/${auctionId}/reject-offer/${bidId}`, {});
    // art/:auctionId/reject-offer/:bidId
    return this.#http.patch<any>(`${this.#baseUrl}/last-chance-auctions/art/${auctionId}/reject-offer/${bidId}`, {});
  }
}
