import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CompletedArtAuctions } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletedArtAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getCompletedAuctions$(
    currentPage: number,
    pageSize: number,
    category?: string,
    range?: { yearFrom: number, yearTo: number },
    states?: string,
    searchTerm?: string,
  ): Observable<CompletedArtAuctions> {
    const url = `${this.#baseUrl}/auctions-cars/completed-art`;

    let params = new HttpParams();

    params = params.set('page', currentPage.toString());
    params = params.set('size', pageSize.toString());
    if (category) { params = params.set('category', category); }
    if (range && range.yearFrom && range.yearTo) { params = params.set('yearFrom', range.yearFrom.toString()); params = params.set('yearTo', range.yearTo.toString()); }
    if (states) { params = params.set('state', states); }
    if (searchTerm) { params = params.set('searchTerm', searchTerm); }

    return this.#http.get<CompletedArtAuctions>(url, { params });
  }
}
