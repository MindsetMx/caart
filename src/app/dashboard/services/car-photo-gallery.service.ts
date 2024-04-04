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
}
