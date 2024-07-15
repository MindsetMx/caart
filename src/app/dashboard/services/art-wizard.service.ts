import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ArtWizard, UserDetails } from '@dashboard/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class ArtWizardService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getArtWizardData$(auctionCarId: string): Observable<ArtWizard> {
    return this.#http.get<ArtWizard>(`${this.#baseUrl}/auctions-cars/get-wizard-data-art/${auctionCarId}`);
  }

  getUserDetails$(auctionCarId: string): Observable<UserDetails> {
    return this.#http.get<UserDetails>(`${this.#baseUrl}/auctions-cars/${auctionCarId}/user-details`);
  }
}
