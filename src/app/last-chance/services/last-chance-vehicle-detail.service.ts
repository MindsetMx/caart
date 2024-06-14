import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { LastChanceAuctionVehicleDetail } from '@lastChance/interfaces';

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
}
