import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplyDiscountCode, AuctionTypes } from '@app/register-car/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionArtWizardSteps } from '@app/art/interfaces';
import { AppService } from '@app/app.service';

@Injectable({
  providedIn: 'root'
})
export class CompleteArtRegistrationService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  numberOfSteps = signal(2);
  indexCurrentStep = signal(0);
  indexTargetStep = signal(0);

  originalAuctionArtId = signal('');

  changeStep(step: number) {
    if (step < 0 || step >= this.numberOfSteps()) return;

    this.indexTargetStep.set(step);
  }

  applyDiscountCode$(discountCode: string): Observable<ApplyDiscountCode> {
    const url = `${this.#baseUrl}/discounts/validate/${discountCode}`;

    return this.#http.get<ApplyDiscountCode>(url);
  }

  completeArtRegistrationPayment$(generalInformation: FormGroup): Observable<any> {
    const url = `${this.#baseUrl}/users/complete-art-registration-with-payment`;

    return this.#http.patch<any>(url, generalInformation.value);
  }

  getAuctionTypes$(): Observable<AuctionTypes> {
    const url = `${this.#baseUrl}/auction-types`;

    return this.#http.get<AuctionTypes>(url);
  }

  wizardSteps$(publicationId: string): Observable<AuctionArtWizardSteps> {
    const url = `${this.#baseUrl}/auction-items/auction-art-publish/${publicationId}/wizard-steps`;

    return this.#http.get<AuctionArtWizardSteps>(url);
  }

  saveArtDetailInfo$(artDetailInfo: FormGroup): Observable<any> {
    const trimmedArtDetailInfo = this.#appService.trimObjectValues(artDetailInfo.value);

    const url = `${this.#baseUrl}/art-detail-info`;

    return this.#http.post<any>(url, trimmedArtDetailInfo);
  }
}
