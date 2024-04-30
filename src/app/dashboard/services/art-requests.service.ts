import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ArtRequests } from '@app/dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArtRequestsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getArtRequests$(): Observable<ArtRequests> {
    return this.#http.get<ArtRequests>(`${this.#baseUrl}/auction-items/all-auction-art`);
  }

  acceptPublicationRequest$(id: string): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/auction-items/art/${id}/accept`, {});
  }

  rejectPublicationRequest$(id: string): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/auction-items/art/${id}/reject`, {});
  }
}
