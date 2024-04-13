import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ImagesPublish } from '../interfaces/images-publish';

@Injectable({
  providedIn: 'root'
})
export class AuctionImageAssigmentAndReorderService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  imagesPublish$(auctionCarId: string): Observable<ImagesPublish> {
    return this.#http.get<ImagesPublish>(`${this.#baseUrl}/auctions-cars/images-publish?auctionCarId=${auctionCarId}`);
  }
}
