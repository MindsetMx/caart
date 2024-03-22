import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplyDiscountCode, AuctionTypes } from '@app/register-car/interfaces';
import { environments } from '@env/environments';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';

@Injectable({
  providedIn: 'root'
})
export class CompleteMemorabiliaRegistrationService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  getAuctionTypes$(): Observable<AuctionTypes> {
    const url = `${this.#baseUrl}/auction-types`;

    return this.#http.get<AuctionTypes>(url);
  }

  applyDiscountCode$(discountCode: string): Observable<ApplyDiscountCode> {
    const url = `${this.#baseUrl}/discounts/validate/${discountCode}`;

    return this.#http.get<ApplyDiscountCode>(url);
  }

  saveGeneralInformation$(generalInformation: FormGroup): Observable<any> {
    const trimmedGeneralInformation = this.#appService.trimObjectValues(generalInformation.value);

    const url = `${this.#baseUrl}/users/complete-memorabilia-registration-with-payment`;

    return this.#http.patch<any>(url, trimmedGeneralInformation);
  }

  wizardSteps$(publicationId: string): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/auction-memorabilia-publish/${publicationId}/wizard-steps`;

    return this.#http.get<any>(url);
  }
}
