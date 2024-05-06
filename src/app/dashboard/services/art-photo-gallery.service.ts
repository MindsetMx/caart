import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtPhotoGalleryService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllArtMedia$(auctionArtId: string): Observable<any> {
    return this.#http.get<any>(`${this.#baseUrl}/auctions-cars/all-art-media?auctionArtId=${auctionArtId}`);
  }
}
