import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetAllAuctions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAllAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllLiveAuctions$(page: number, size: number): Observable<GetAllAuctions> {
    return this.#http.get<GetAllAuctions>(`${this.#baseUrl}/auctions-cars/all-live-auctions?page=${page}&size=${size}`);
  }
}
