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

    return this.#http.get<AuctionCarPublications>(url);
  }

  acceptPublicationRequest$(id: string): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/${id}/accept`;

    return this.#http.patch<any>(url, {});
  }

  rejectPublicationRequest$(id: string): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/${id}/reject`;

    return this.#http.patch<any>(url, {});
  }

  // auction-items/all-auction-cars
  // http://localhost:3000/auction-items/all-auction-cars?page=1&size=10&orderBy=createdAt&order=-1
  getAllAuctionCars$(): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/all-auction-cars?page=1&size=10&orderBy=createdAt&order=-1`;

    return this.#http.get<any>(url);
  }

}
