import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CarAuctionPreview } from '@dashboard/interfaces/car-auction-preview';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class EditCarAuctionPreviewService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  editCarAuctionPreview$(formGroup: FormGroup): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/auctions-cars/update-preview-car`, formGroup.value);
  }

  getCarAuctionPreview$(auctionCarId: string): Observable<CarAuctionPreview> {
    return this.#http.get<CarAuctionPreview>(`${this.#baseUrl}/auctions-cars/preview-car/${auctionCarId}`);
  }
}
