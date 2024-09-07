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
    return this.#http.get<ActivityRequests>(`${this.#baseUrl}/auctions-cars/mis-solicitudes?size=${size}&page=${page}&sort=asc`);
  }

  acceptPreviewCar$(originalAuctionCarId: string): Observable<any> {
    return this.#http.post(`${this.#baseUrl}/auctions-cars/accept-preview-car`, { originalAuctionCarId });
  }

  acceptPreviewArt$(originalAuctionArtId: string): Observable<any> {
    return this.#http.post(`${this.#baseUrl}/auctions-cars/accept-preview-art`, { originalAuctionArtId });
  }
}
