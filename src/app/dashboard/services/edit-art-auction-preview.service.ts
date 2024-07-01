import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ArtAuctionPreview } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EditArtAuctionPreviewService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  editArtAuctionPreview$(formGroup: FormGroup): Observable<void> {
    return this.#http.post<void>(`${this.#baseUrl}/auctions-cars/update-preview-art`, formGroup.value);
  }

  getArtAuctionPreview$(auctionArtId: string): Observable<ArtAuctionPreview> {
    return this.#http.get<ArtAuctionPreview>(`${this.#baseUrl}/auctions-cars/preview-art/${auctionArtId}`);
  }
}
