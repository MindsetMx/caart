import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { LastChanceAuctionArtDetail } from '@lastChance/interfaces/last-chance-auction-art-detail';

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
}
