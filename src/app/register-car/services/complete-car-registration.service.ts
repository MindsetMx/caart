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

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<GeneralDetails>(url, { headers });
  }

  getInteriorOfTheCar$(auctionCarId: string): Observable<InteriorOfTheCar> {
    const url = `${this.#baseUrl}/interior-detail-cars/${auctionCarId}`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<InteriorOfTheCar>(url, { headers });
  }

  getMechanics$(auctionCarId: string): Observable<Mechanics> {
    const url = `${this.#baseUrl}/mechanics-detail-cars/${auctionCarId}`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<Mechanics>(url, { headers });
  }

  getCarExtras$(auctionCarId: string): Observable<Extras> {
    const url = `${this.#baseUrl}/extras/${auctionCarId}`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<Extras>(url, { headers });
  }

  saveGeneralInformation$(generalInformation: FormGroup): Observable<any> {
    const trimmedGeneralInformation = this.#appService.trimObjectValues(generalInformation.value);

    const url = `${this.#baseUrl}/users/complete-registration-with-payment`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.patch<any>(url, trimmedGeneralInformation, { headers });
  }

  applyDiscountCode$(discountCode: string): Observable<ApplyDiscountCode> {
    const url = `${this.#baseUrl}/discounts/validate/${discountCode}`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<ApplyDiscountCode>(url, { headers });
  }

  saveGeneralDetailsAndExteriorOfTheCar$(generalDetailsAndExteriorOfTheCar: FormGroup): Observable<any> {
    const trimmedGeneralDetailsAndExteriorOfTheCar = this.#appService.trimObjectValues(generalDetailsAndExteriorOfTheCar.value);

    const url = `${this.#baseUrl}/exterior-detail-cars`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.post<any>(url, trimmedGeneralDetailsAndExteriorOfTheCar, { headers });
  }

  saveInteriorOfTheCar$(interiorOfTheCar: FormGroup): Observable<any> {
    const trimmedInteriorOfTheCar = this.#appService.trimObjectValues(interiorOfTheCar.value);

    const url = `${this.#baseUrl}/interior-detail-cars`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.post<any>(url, trimmedInteriorOfTheCar, { headers });
  }

  saveMechanics$(mechanics: FormGroup): Observable<any> {
    const trimmedMechanics = this.#appService.trimObjectValues(mechanics.value);

    const url = `${this.#baseUrl}/mechanics-detail-cars`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.post<any>(url, trimmedMechanics, { headers });
  }

  saveCarExtras$(carExtras: FormGroup): Observable<any> {
    const trimmedCarExtras = this.#appService.trimObjectValues(carExtras.value);

    const url = `${this.#baseUrl}/extras`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.post<any>(url, trimmedCarExtras, { headers });
  }

  getAuctionTypes$(): Observable<AuctionTypes> {
    const url = `${this.#baseUrl}/auction-types`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<AuctionTypes>(url, { headers });
  }

  addPaymentMethod(stripeToken: string): Observable<any> {
    const url = `${this.#baseUrl}/users/add-payment-method`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.patch<any>(url, { stripeToken }, { headers });
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

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<WizardSteps>(url, { headers });
  }
}
