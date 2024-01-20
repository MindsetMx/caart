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
import { WizardSteps } from '../interfaces';
import { AuctionTypes } from '../interfaces/auctionTypes';
import { FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  readonly #baseurl = environments.baseUrl;

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


  saveGeneralInformation$(generalInformation: FormGroup): Observable<any> {
    const trimmedGeneralInformation = this.#appService.trimObjectValues(generalInformation.value);

    const url = `${this.#baseurl}/users/complete-registration-with-payment`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.patch<any>(url, trimmedGeneralInformation, { headers });
  }

  getAuctionTypes$(): Observable<AuctionTypes> {
    const url = `${this.#baseurl}/auction-types`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<AuctionTypes>(url, { headers });
  }

  addPaymentMethod(stripeToken: string): Observable<any> {
    const url = `${this.#baseurl}/users/add-payment-method`;

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

  wizardSteps$(publicationId: string): Observable<WizardSteps> {
    const url = `${this.#baseurl}/auction-items/auction-car-publish/${publicationId}/wizard-steps`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.#http.get<WizardSteps>(url, { headers });
  }
}
