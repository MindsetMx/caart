import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { LastChanceAuctionVehicleDetail, LastChanceBids } from '@lastChance/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LastChanceVehicleDetailService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionDetails$(id: string): Observable<LastChanceAuctionVehicleDetail> {
    const url = `${this.#baseUrl}/auctions-cars/last-chance-auction/${id}`;

    return this.#http.get<LastChanceAuctionVehicleDetail>(url);
  }

  getMetrics$(id: string): Observable<AuctionMetrics> {
    const url = `${this.#baseUrl}/auctions-cars/${id}/metrics`;

    return this.#http.get<AuctionMetrics>(url);
  }

  // http://localhost:3000/auctions-cars/auction/last-chance-art/panel-bids/66ce7a58274975f3908683fb?page=1&size=5
  getPanelBids$(id: string, page: number, size: number): Observable<LastChanceBids> {
    const url = `${this.#baseUrl}/auctions-cars/auction/last-chance/panel-bids/${id}?page=${page}&size=${size}`;

    return this.#http.get<LastChanceBids>(url);
  }
}
