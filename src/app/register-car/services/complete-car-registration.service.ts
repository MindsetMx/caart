import { AuctionTypes as AuctionTypes2 } from '@app/auctions/enums/auction-types';
import { environments } from '@env/environments';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplyDiscountCode, Extras, GeneralDetails, InteriorOfTheCar, Mechanics, WizardSteps } from '@app/register-car/interfaces';
import { AppService } from '@app/app.service';
import { AuctionTypes } from '@app/register-car/interfaces/auction-types.interface';
import { Colors } from '@app/register-car/interfaces/colors.interface';


@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  numberOfSteps = signal(5);
  indexCurrentStep = signal(0);
  indexTargetStep = signal(0);

  originalAuctionCarId = signal('');

  getGeneralInformation$(auctionCarId: string): Observable<GeneralDetails> {
    const url = `${this.#baseUrl}/exterior-detail-cars/${auctionCarId}`;

    return this.#http.get<GeneralDetails>(url);
  }

  getInteriorOfTheCar$(auctionCarId: string): Observable<InteriorOfTheCar> {
    const url = `${this.#baseUrl}/interior-detail-cars/${auctionCarId}`;

    return this.#http.get<InteriorOfTheCar>(url);
  }

  getMechanics$(auctionCarId: string): Observable<Mechanics> {
    const url = `${this.#baseUrl}/mechanics-detail-cars/${auctionCarId}`;

    return this.#http.get<Mechanics>(url);
  }

  getCarExtras$(auctionCarId: string): Observable<Extras> {
    const url = `${this.#baseUrl}/extras/${auctionCarId}`;

    return this.#http.get<Extras>(url);
  }

  saveGeneralInformation$(generalInformation: FormGroup): Observable<any> {
    const trimmedGeneralInformation = this.#appService.trimObjectValues(generalInformation.value);

    const url = `${this.#baseUrl}/users/complete-registration-with-payment`;

    return this.#http.patch<any>(url, trimmedGeneralInformation);
  }

  applyDiscountCode$(discountCode: string): Observable<ApplyDiscountCode> {
    const url = `${this.#baseUrl}/discounts/validate/${discountCode}/car`;

    return this.#http.get<ApplyDiscountCode>(url);
  }

  saveGeneralDetailsAndExteriorOfTheCar$(generalDetailsAndExteriorOfTheCar: FormGroup): Observable<any> {
    const trimmedGeneralDetailsAndExteriorOfTheCar = this.#appService.trimObjectValues(generalDetailsAndExteriorOfTheCar.value);

    const url = `${this.#baseUrl}/exterior-detail-cars`;

    return this.#http.post<any>(url, trimmedGeneralDetailsAndExteriorOfTheCar);
  }

  saveInteriorOfTheCar$(interiorOfTheCar: FormGroup): Observable<any> {
    const trimmedInteriorOfTheCar = this.#appService.trimObjectValues(interiorOfTheCar.value);

    const url = `${this.#baseUrl}/interior-detail-cars`;

    return this.#http.post<any>(url, trimmedInteriorOfTheCar);
  }

  saveMechanics$(mechanics: FormGroup): Observable<any> {
    const {
      tireBrand,
      tireSize,
      spareTire,
      comments,
      mechanicsPhotos,
      mechanicsVideos,
      originalAuctionCarId,
    } = mechanics.value;

    const trimmedMechanics = this.#appService.trimObjectValues({
      tireBrand,
      tireSize,
      spareTire,
      comments,
      mechanicsPhotos,
      mechanicsVideos,
      originalAuctionCarId,
    });

    const url = `${this.#baseUrl}/mechanics-detail-cars`;

    return this.#http.post<any>(url, trimmedMechanics);
  }

  saveCarExtras$(carExtras: FormGroup): Observable<any> {
    const { comments, termsConditionsAccepted, originalAuctionCarId } = carExtras.value;

    const trimmedCarExtras = this.#appService.trimObjectValues({
      comments,
      termsConditionsAccepted,
      originalAuctionCarId,
    });

    const url = `${this.#baseUrl}/extras`;

    return this.#http.post<any>(url, trimmedCarExtras);
  }

  getAuctionTypes$(type: AuctionTypes2): Observable<AuctionTypes> {
    const url = `${this.#baseUrl}/auction-types`;

    const params = new HttpParams().set('type', type);

    return this.#http.get<AuctionTypes>(url, { params });
  }

  addPaymentMethod(stripeToken: string): Observable<any> {
    const url = `${this.#baseUrl}/users/add-payment-method`;

    return this.#http.patch<any>(url, { stripeToken });
  }

  changeStep(step: number) {
    if (step < 0 || step >= this.numberOfSteps()) return;

    this.indexTargetStep.set(step);
  }

  getColors$(): Observable<Colors[]> {
    return this.#http.get<Colors[]>(`${this.#baseUrl}/car-colors`);
  }

  wizardSteps$(publicationId: string): Observable<WizardSteps> {
    const url = `${this.#baseUrl}/auction-items/auction-car-publish/${publicationId}/wizard-steps`;

    return this.#http.get<WizardSteps>(url);
  }
}
