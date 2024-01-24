import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionCarPublications } from '../interfaces/auction-car-publishes';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  auctionCarPublications$(): Observable<AuctionCarPublications> {
    const url = `${this.#baseUrl}/auction-items/auction-car-publishes`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.#http.get<AuctionCarPublications>(url, { headers });
  }

  getPublicationRequests$(): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/auction-cars`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.#http.get<any>(url, { headers });
  }

  acceptPublicationRequest$(id: string): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/${id}/accept`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.#http.patch<any>(url, {}, { headers });
  }

}
