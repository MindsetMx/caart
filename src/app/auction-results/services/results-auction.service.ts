import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionResults } from '@app/auction-results/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ResultsAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllLiveAuctions$(
    page: number,
    size: number,
    sort?: string,
    type?: string,
    epoch?: string,
    state?: string,
    range?: { yearFrom: number, yearTo: number },
  ): Observable<AuctionResults> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) { params = params.set('sort', sort); }
    if (type) { params = params.set('type', type); }
    if (epoch) { params = params.set('epoch', epoch); }
    if (state) { params = params.set('state', state); }
    if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }

    return this.#http.get<AuctionResults>(`${this.#baseUrl}/auctions-cars/get-all-completed`, { params });
  }
}
