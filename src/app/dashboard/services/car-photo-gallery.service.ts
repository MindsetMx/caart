import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { GetAllCarMedia } from '@dashboard/interfaces';
import { MediaCollection, MediaType } from '@dashboard/enums';

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

  //   /auctions-cars/add-photos-videos
  // 17:31
  // {
  //   "auctionId": "6716b7d3e8e8977236c0d2fb",
  //   "type": "art",
  //   "collection": "extra",
  //   "photoUrls": [
  //     "https://cloudflare.com/photo3.jpg",
  //     "https://cloudflare.com/photo4.jpg"
  //   ],
  //   "videoUrls": []
  // }
  //   type: 'car' | 'art'
  // collection: 'exterior' | 'interior' | 'mechanics' | 'extra';
  addPhotosVideos$(auctionId: string, type: MediaType, collection: MediaCollection, photoUrls: string[], videoUrls: string[]): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/auctions-cars/add-photos-videos`, {
      auctionId,
      type,
      collection,
      photoUrls,
      videoUrls
    });
  }
}
