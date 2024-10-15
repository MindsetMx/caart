import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { LastChanceAuctionArtDetail } from '@lastChance/interfaces/last-chance-auction-art-detail';
import { GetBids } from '@auctions/interfaces/get-bids';
import { LastChanceBids } from '@lastChance/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LastChanceArtDetailService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionDetails$(id: string): Observable<LastChanceAuctionArtDetail> {
    const url = `${this.#baseUrl}/last-chance-auctions/art/${id}`;

    return this.#http.get<LastChanceAuctionArtDetail>(url);
  }

  // http://localhost:3000/auctions-cars/auction/last-chance-art/panel-bids/66ce7a58274975f3908683fb?page=1&size=5
  getPanelBids$(id: string, page: number, size: number): Observable<LastChanceBids> {
    const url = `${this.#baseUrl}/auctions-cars/auction/last-chance-art/panel-bids/${id}?page=${page}&size=${size}`;

    return this.#http.get<LastChanceBids>(url);
  }
}
