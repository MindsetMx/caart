import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ArtMedia } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArtPhotoGalleryService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllArtMedia$(auctionArtId: string): Observable<ArtMedia> {
    return this.#http.get<any>(`${this.#baseUrl}/auctions-cars/all-art-media?auctionArtId=${auctionArtId}`);
  }

  addExtraPhoto$(auctionId: string, photoUrls: string[]): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/extra-photo`, {
      auctionId,
      type: 'art',
      photoUrls
    });
  }
}
