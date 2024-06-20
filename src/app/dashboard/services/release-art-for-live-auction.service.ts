import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { TentativeArtTitle } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReleaseArtForLiveAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  releaseArtForPreview$(releaseArtForLiveAuctionForm: FormGroup): Observable<any> {
    const trimmedReleaseArtForLiveAuctionForm = this.#appService.trimObjectValues(releaseArtForLiveAuctionForm.value);

    // const url = `${this.#baseUrl}/auctions-cars/create-auction-art`;
    // auctions-cars/preview-ART
    const url = `${this.#baseUrl}/auctions-cars/preview-art`;

    return this.#http.post<any>(url, trimmedReleaseArtForLiveAuctionForm);
  }

  getTentativeTitle$(auctionItemId: string): Observable<TentativeArtTitle> {
    const url = `${this.#baseUrl}/auction-items/${auctionItemId}/tentative-title-art`;

    return this.#http.get<TentativeArtTitle>(url);
  }
}
