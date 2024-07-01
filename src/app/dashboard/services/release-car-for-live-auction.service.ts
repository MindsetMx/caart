import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { CalculateStartingBidCarAuction, TentativeTitle } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReleaseCarForLiveAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  releaseCarForPreview$(releaseCarForLiveAuctionForm: FormGroup): Observable<any> {
    const trimmedReleaseCarForLiveAuctionForm = this.#appService.trimObjectValues(releaseCarForLiveAuctionForm.value);

    // const url = `${this.#baseUrl}/auctions-cars`;
    // auctions-cars/preview
    const url = `${this.#baseUrl}/auctions-cars/preview`;

    return this.#http.post<any>(url, trimmedReleaseCarForLiveAuctionForm);
  }

  getTentativeTitle$(auctionItemId: string): Observable<TentativeTitle> {
    const url = `${this.#baseUrl}/auction-items/${auctionItemId}/tentative-title`;

    return this.#http.get<TentativeTitle>(url);
  }

  // auctions-cars/calculate-starting-bid/6667a1d84594ab550f4b89b0
  calculateStartingBid$(auctionItemId: string): Observable<CalculateStartingBidCarAuction> {
    const url = `${this.#baseUrl}/auctions-cars/calculate-starting-bid/${auctionItemId}`;

    return this.#http.get<CalculateStartingBidCarAuction>(url);
  }
}
