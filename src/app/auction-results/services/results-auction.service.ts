import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionResults } from '@app/auction-results/interfaces';

import { ResultTypes } from '@app/auction-results/enums';

@Injectable({
  providedIn: 'root'
})
export class ResultsAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // getAllLiveAuctions$(
  //   page: number,
  //   size: number,
  //   sort?: string,
  //   type?: string,
  //   epoch?: string,
  //   state?: string,
  //   range?: { yearFrom: number, yearTo: number },
  // ): Observable<AuctionResults> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('size', size.toString());

  //   if (sort) { params = params.set('sort', sort); }
  //   if (type) { params = params.set('type', type); }
  //   if (epoch) { params = params.set('epoch', epoch); }
  //   if (state) { params = params.set('state', state); }
  //   if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }

  //   return this.#http.get<AuctionResults>(`${this.#baseUrl}/auctions-cars/get-all-completed`, { params });
  // }

  // types=[car,art,any]
  // filters: type, epoch, yearFrom, yearTo, state, sort, searchTerm
  // https://caart.com.mx/back/auctions-cars/get-all-completed?page=1&size=10&sort=asc&type=any
  getLiveAuctions$(
    auctionType: ResultTypes,
    page: number,
    size: number,
    sort?: string,
    type?: string,
    epoch?: string,
    state?: string,
    range?: { yearFrom: number, yearTo: number },
    searchTerm?: string,
  ): Observable<AuctionResults> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (auctionType) { params = params.set('auctionType', auctionType); }
    if (sort) { params = params.set('sort', sort); }
    if (type) { params = params.set('type', type); }
    if (epoch) { params = params.set('epoch', epoch); }
    if (state) { params = params.set('state', state); }
    if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }
    if (searchTerm) { params = params.set('searchTerm', searchTerm); }

    return this.#http.get<AuctionResults>(`${this.#baseUrl}/auctions-cars/get-all-completed`, { params });
  }
}
