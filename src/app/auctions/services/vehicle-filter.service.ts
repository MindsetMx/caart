import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { VehicleAuction } from '@app/auctions/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VehicleFilterService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getLiveAuctions$(
    page: number,
    size: number,
    auctionType?: string,
    category?: string,
    era?: string,
    range?: { yearFrom: number, yearTo: number },
    currentOffer?: string,
    orderBy?: string,
    endsIn?: string,
    states?: string,
    search?: string,
    excludeId?: string | null
  ): Observable<VehicleAuction> {
    const url = `${this.#baseUrl}/auctions-cars/live-auctions`;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (auctionType) { params = params.set('type', auctionType); }
    if (category) { params = params.set('category', category); }
    if (era) { params = params.set('epoch', era); }
    if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }
    if (currentOffer) { params = params.set('currentBid', currentOffer); }
    if (orderBy) { params = params.set('sort', orderBy); }
    if (endsIn) { params = params.set('endingIn', endsIn); }
    if (states) { params = params.set('state', states); }
    if (search) { params = params.set('searchTerm', search); }
    if (excludeId) { params = params.set('excludeId', excludeId); }

    return this.#http.get<VehicleAuction>(url, { params });
  }
}
