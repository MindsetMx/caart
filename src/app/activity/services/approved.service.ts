import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { Approved } from '@activity/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApprovedService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getMyApproved$(page: number, size: number): Observable<Approved> {
    const params = new HttpParams()
      .set('orderBy', '-1')
      .set('page', page)
      .set('size', size);

    return this.#http.get<Approved>(`${this.#baseUrl}/auctions-cars/all-my-live-auctions`, { params });
  }
}
