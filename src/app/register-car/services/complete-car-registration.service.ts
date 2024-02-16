import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environments } from '@env/environments';

import { CarExtrasComponent } from '@registerCarComponents/car-extras/car-extras.component';
import { GeneralDetailsAndExteriorOfTheCarComponent } from '@registerCarComponents/general-details-and-exterior-of-the-car/general-details-and-exterior-of-the-car.component';
import { GeneralInformationComponent } from '@registerCarComponents/general-information/general-information.component';
import { InteriorOfTheCarComponent } from '@registerCarComponents/interior-of-the-car/interior-of-the-car.component';
import { MechanicsComponent } from '@registerCarComponents/mechanics/mechanics.component';
import { Observable } from 'rxjs';
import { ApplyDiscountCode, Brands, Extras, GeneralDetails, InteriorOfTheCar, Mechanics, WizardSteps } from '../interfaces';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { AuctionTypes } from '@app/register-car/interfaces/auction-types.interface';
import { Colors } from '../interfaces/colors.interface';

@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  steps = [
    GeneralInformationComponent,
    GeneralDetailsAndExteriorOfTheCarComponent,
    InteriorOfTheCarComponent,
    MechanicsComponent,
    CarExtrasComponent,
  ];

  indexCurrentStep: WritableSignal<number> = signal(0);
  indexTargetStep: WritableSignal<number> = signal(0);

  originalAuctionCarId: WritableSignal<string> = signal('');

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
    const url = `${this.#baseUrl}/discounts/validate/${discountCode}`;

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
    const trimmedMechanics = this.#appService.trimObjectValues(mechanics.value);

    const url = `${this.#baseUrl}/mechanics-detail-cars`;

    return this.#http.post<any>(url, trimmedMechanics);
  }

  saveCarExtras$(carExtras: FormGroup): Observable<any> {
    const trimmedCarExtras = this.#appService.trimObjectValues(carExtras.value);

    const url = `${this.#baseUrl}/extras`;

    return this.#http.post<any>(url, trimmedCarExtras);
  }

  getAuctionTypes$(): Observable<AuctionTypes> {
    const url = `${this.#baseUrl}/auction-types`;

    return this.#http.get<AuctionTypes>(url);
  }

  addPaymentMethod(stripeToken: string): Observable<any> {
    const url = `${this.#baseUrl}/users/add-payment-method`;

    return this.#http.patch<any>(url, { stripeToken });
  }

  changeStep(step: number) {
    if (step < 0 || step >= this.steps.length) return;

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
