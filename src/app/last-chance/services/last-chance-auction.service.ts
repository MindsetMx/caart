import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { LastChanceAuctions } from '@lastChance/interfaces/last-chance-auctions';

@Injectable({
  providedIn: 'root'
})
export class LastChanceAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // auctions-cars/last-chance
  getAllLastChanceAuctions$(
    page: number,
    size: number,
    sort?: string,
    epoch?: string,
    currentBid?: string,
    state?: string,
    range?: { yearFrom: number, yearTo: number },
    endingIn?: string
  ): Observable<LastChanceAuctions> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) { params = params.set('sort', sort); }
    if (epoch) { params = params.set('epoch', epoch); }
    if (currentBid) { params = params.set('currentBid', currentBid); }
    if (state) { params = params.set('state', state); }
    if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }
    if (endingIn) { params = params.set('endingIn', endingIn); }

    return this.#http.get<LastChanceAuctions>(`${this.#baseUrl}/auctions-cars/last-chance`, { params });
  }
}
