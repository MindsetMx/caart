import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RecentlyCompletedCarAuctions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecentlyCompletedCarAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // auctions-cars/finished-auctions?page=1&size=10
  getRecentlyCompletedCarAuctions$(page: number, size: number): Observable<RecentlyCompletedCarAuctions> {
    const url = `${this.#baseUrl}/auctions-cars/finished-auctions`;

    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.#http.get<RecentlyCompletedCarAuctions>(url, { params });
  }
}
