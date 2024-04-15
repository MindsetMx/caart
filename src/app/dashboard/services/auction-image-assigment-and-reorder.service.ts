import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { ImagesPublish } from '../interfaces/images-publish';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuctionImageAssigmentAndReorderService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  imagesPublish$(auctionCarId: string): Observable<ImagesPublish> {
    return this.#http.get<ImagesPublish>(`${this.#baseUrl}/auctions-cars/images-publish?auctionCarId=${auctionCarId}`);
  }

  saveImagesPublish$(auctionCarId: string, formGroup: FormGroup): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/auctions-cars/save-images-publish`, {
      auctionCarId,
      ...formGroup.value
    });
  }
}
