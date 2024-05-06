import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReleaseArtForLiveAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  releaseArtForLiveAuction$(releaseArtForLiveAuctionForm: FormGroup): Observable<any> {
    const trimmedReleaseArtForLiveAuctionForm = this.#appService.trimObjectValues(releaseArtForLiveAuctionForm.value);

    const url = `${this.#baseUrl}/auctions-cars/create-auction-art`;

    return this.#http.post<any>(url, trimmedReleaseArtForLiveAuctionForm);
  }

  // getTentativeTitle$(auctionItemId: string): Observable<any> {
  //   const url = `${this.#baseUrl}/auction-items/${auctionItemId}/tentative-title`;

  //   return this.#http.get<any>(url);
  // }
}
