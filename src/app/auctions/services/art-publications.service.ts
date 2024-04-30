import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuctionArtPublications } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtPublicationsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAuctionArtPublications$(): Observable<AuctionArtPublications> {
    return this.#http.get<AuctionArtPublications>(`${this.#baseUrl}/auction-items/auction-art-publishes`);
  }
}
