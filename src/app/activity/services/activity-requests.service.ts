import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ActivityRequests } from '@activity/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ActivityRequestsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getMyRequests$(page: number, size: number): Observable<ActivityRequests> {
    return this.#http.get<ActivityRequests>(`${this.#baseUrl}/auctions-cars/mis-solicitudes?size=${size}&page=${page}&orderBy=1`);
  }
}
