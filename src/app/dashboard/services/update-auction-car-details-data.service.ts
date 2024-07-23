import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateAuctionCarDetailsDataService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  // PUT /update-exterior-details/:auctionCarId
  updateExteriorDetails$(auctionCarId: string, form: FormGroup): Observable<any> {
    const trimmedGeneralDetailsAndExteriorOfTheCar = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-exterior-details/${auctionCarId}`, trimmedGeneralDetailsAndExteriorOfTheCar);
  }

  // /update-extras-details/:auctionCarId
  updateExtrasDetails$(auctionCarId: string, form: FormGroup): Observable<any> {
    const trimmedExtrasDetails = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-extras-details/${auctionCarId}`, trimmedExtrasDetails);
  }

  // /update-interior-details/:auctionCarId
  updateInteriorDetails$(auctionCarId: string, form: FormGroup): Observable<any> {
    const trimmedInteriorOfTheCar = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-interior-details/${auctionCarId}`, trimmedInteriorOfTheCar);
  }

  // /update-mechanics-details/:auctionCarId
  updateMechanicsDetails$(auctionCarId: string, form: FormGroup): Observable<any> {
    const trimmedMechanicsDetails = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-mechanics-details/${auctionCarId}`, trimmedMechanicsDetails);
  }

  // PUT /update-register-car-details/:auctionCarId
  updateRegisterCarDetails$(auctionCarId: string, form: FormGroup): Observable<any> {
    const trimmedRegisterCarDetails = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-register-car-details/${auctionCarId}`, trimmedRegisterCarDetails);
  }
}
