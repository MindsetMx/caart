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
  updateExteriorDetails(auctionCarId: string, form: FormGroup): Observable<any> {
    const trimmedGeneralDetailsAndExteriorOfTheCar = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-exterior-details/${auctionCarId}`, trimmedGeneralDetailsAndExteriorOfTheCar);
  }
}
