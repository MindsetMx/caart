import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AllAuctionArt } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArtRequestsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // aucion-items/all-auction-art
  // http://localhost:3000/auction-items/all-auction-art?page=1&size=10&orderBy=createdAt&order=-1
  getAllAuctionArt$(): Observable<AllAuctionArt> {
    return this.#http.get<any>(`${this.#baseUrl}/auction-items/all-auction-art?page=1&size=10&orderBy=createdAt&order=-1`);
  }

  acceptPublicationRequest$(id: string): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/auction-items/art/${id}/accept`, {});
  }

  rejectPublicationRequest$(id: string): Observable<void> {
    return this.#http.patch<void>(`${this.#baseUrl}/auction-items/art/${id}/reject`, {});
  }
}
