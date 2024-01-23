import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environments } from '@env/environments';

import { CarExtrasComponent } from '@registerCarComponents/car-extras/car-extras.component';
import { CarRegistrationConfirmationComponent } from '@registerCarComponents/car-registration-confirmation/car-registration-confirmation.component';
import { GeneralDetailsAndExteriorOfTheCarComponent } from '@registerCarComponents/general-details-and-exterior-of-the-car/general-details-and-exterior-of-the-car.component';
import { GeneralInformationComponent } from '@registerCarComponents/general-information/general-information.component';
import { InteriorOfTheCarComponent } from '@registerCarComponents/interior-of-the-car/interior-of-the-car.component';
import { MechanicsComponent } from '@registerCarComponents/mechanics/mechanics.component';
import { Observable } from 'rxjs';
import { Brands, WizardSteps } from '../interfaces';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { AuctionTypes } from '@app/register-car/interfaces/auctionTypes';
import { Colors } from '../interfaces/colors';

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
    CarRegistrationConfirmationComponent,
  ];

  indexCurrentStep: WritableSignal<number> = signal(0);
  originalAuctionCarId: WritableSignal<string> = signal('');

  saveGeneralInformation$(generalInformation: FormGroup): Observable<any> {
    const trimmedGeneralInformation = this.#appService.trimObjectValues(generalInformation.value);

    const url = `${this.#baseUrl}/users/complete-registration-with-payment`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.patch<any>(url, trimmedGeneralInformation, { headers });
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

    this.indexCurrentStep.set(step);
  }

  getBrands$(): Observable<Brands> {
    return this.#http.get<Brands>(`${this.#baseUrl}/car-brands`);
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
