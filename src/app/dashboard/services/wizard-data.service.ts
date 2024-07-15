import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { WizardData } from '../interfaces/wizard-data';
import { UserDetails } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WizardDataService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getWizardData$(auctionCarId: string): Observable<WizardData> {
    return this.#http.get<WizardData>(`${this.#baseUrl}/auctions-cars/get-wizard-data/${auctionCarId}`);
  }

  getUserDetails$(auctionCarId: string): Observable<UserDetails> {
    return this.#http.get<UserDetails>(`${this.#baseUrl}/auctions-cars/${auctionCarId}/user-details`);
  }
}
