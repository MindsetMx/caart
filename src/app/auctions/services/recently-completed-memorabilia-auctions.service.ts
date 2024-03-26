import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecentlyCompletedMemorabiliaAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // auctions-memorabilia/finished-auctions?page=1&size=10
  getRecentlyCompletedMemorabiliaAuctions$(page: number, size: number): Observable<any> {
    const url = `${this.#baseUrl}/auctions-memorabilia/finished-auctions`;

    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.#http.get(url, { params });
  }
}
