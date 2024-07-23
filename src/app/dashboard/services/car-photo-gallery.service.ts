import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { GetAllCarMedia } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CarPhotoGalleryService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getAllCarMedia$(auctionCarId: string): Observable<GetAllCarMedia> {
    return this.#http.get<GetAllCarMedia>(`${this.#baseUrl}/auctions-cars/all-media?auctionCarId=${auctionCarId}`);
  }

  // https://caart.com.mx/back/extra-photo
  // {
  //   "auctionId": "66647beb5e223911771a2f5b",
  //   "type": "car",
  //   "photoUrls": [
  //     "https://example.com/photo1.jpg",
  //     "https://example.com/photo2.jpg",
  //     "https://example.com/photo3.jpg",
  //     "https://example.com/photo4.jpg"
  //   ]
  // }
  addExtraPhoto$(auctionId: string, photoUrls: string[]): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/extra-photo`, {
      auctionId,
      type: 'car',
      photoUrls
    });
  }
}
