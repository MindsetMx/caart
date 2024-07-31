import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { LiveAuctionsTabs } from '@dashboard/enums';
import { GetLiveAuctions } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LiveAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // https://caart.com.mx/back/auctions-cars/all-live-auctions?page=1&size=10&orderBy=1&type=all
  getLiveAuctions$(page: number, size: number, orderBy: number, type: LiveAuctionsTabs): Observable<GetLiveAuctions> {
    return this.#http.get<GetLiveAuctions>(`${this.#baseUrl}/auctions-cars/all-live-auctions?page=${page}&size=${size}&orderBy=${orderBy}&type=${type}`);
  }
}
