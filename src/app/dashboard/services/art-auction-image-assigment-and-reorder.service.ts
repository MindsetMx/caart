import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ArtImagesPublish } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArtAuctionImageAssigmentAndReorderService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  imagesPublish$(auctionArtId: string): Observable<ArtImagesPublish> {
    return this.#http.get<ArtImagesPublish>(`${this.#baseUrl}/auctions-cars/art-images-publish?auctionArtId=${auctionArtId}`);
  }

  saveImagesPublish$(auctionArtId: string, formGroup: FormGroup): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/auctions-cars/save-art-images-publish`, {
      auctionArtId,
      ...formGroup.value
    });
  }
}
