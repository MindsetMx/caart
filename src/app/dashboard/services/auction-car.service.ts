import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionCarInfo } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuctionCarService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  #dashboardInfo$(page: number = 1, size: number = 5, orderBy: string = 'brand', orderDirection: number = 1): Observable<AuctionCarInfo> {
    return this.#http.get<AuctionCarInfo>(`${this.#baseUrl}/auctions-cars/dashboard-info?page=${page}&size=${size}&orderBy=${orderBy}&orderDirection=${orderDirection}`);
  }

  auctionCarInfo = toSignal(this.#dashboardInfo$());
}
