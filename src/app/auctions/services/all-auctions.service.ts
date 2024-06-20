import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GetAllAuctions, GetLiveCarAuction } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAllAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllLiveAuctions$(
    page: number,
    size: number,
    sort?: string,
    type?: string,
    epoch?: string,
    currentBid?: string,
    state?: string,
    range?: { yearFrom: number, yearTo: number },
    endingIn?: string
  ): Observable<GetAllAuctions> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) { params = params.set('sort', sort); }
    if (type) { params = params.set('type', type); }
    if (epoch) { params = params.set('epoch', epoch); }
    if (currentBid) { params = params.set('currentBid', currentBid); }
    if (state) { params = params.set('state', state); }
    if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }
    if (endingIn) { params = params.set('endingIn', endingIn); }

    return this.#http.get<GetAllAuctions>(`${this.#baseUrl}/auctions-cars/live-auctions-all`, { params });
  }
}
