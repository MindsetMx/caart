import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReleaseCarForLiveAuctionService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  releaseCarForLiveAuction$(releaseCarForLiveAuctionForm: FormGroup): Observable<any> {
    const trimmedReleaseCarForLiveAuctionForm = this.#appService.trimObjectValues(releaseCarForLiveAuctionForm.value);

    const url = `${this.#baseUrl}/auctions-cars`;

    return this.#http.post<any>(url, trimmedReleaseCarForLiveAuctionForm);
  }
}