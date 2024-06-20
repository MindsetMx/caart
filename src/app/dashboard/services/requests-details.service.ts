import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionArtDetails, AuctionDetails } from '@dashboard/interfaces';
@Injectable({
  providedIn: 'root'
})
export class RequestsDetailsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionCarById$(id: string): Observable<AuctionDetails> {
    return this.#http.get<AuctionDetails>(`${this.#baseUrl}/auction-items/auction-car/${id}`);
  }

  getAuctionArtById$(id: string): Observable<AuctionArtDetails> {
    return this.#http.get<AuctionArtDetails>(`${this.#baseUrl}/auction-items/auction-art/${id}`);
  }
}
