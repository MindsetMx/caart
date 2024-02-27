import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastChanceVehicleFilterService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getLastChanceVehicles$(
    page: number,
    size: number,
    era?: string,
    state?: string
  ): Observable<any> {
    const url = `${this.#baseUrl}/last-chance-auctions`;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (era) { params = params.set('epoch', era); }
    if (state) { params = params.set('state', state); }

    return this.#http.get<any>(url, { params });
  }

}
