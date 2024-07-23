import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UpdateAuctionArtDetailsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  // PUT /update-register-art-details/:auctionArtId
  updateRegisterArtDetails$(auctionArtId: string, form: FormGroup): Observable<any> {
    const trimmedRegisterArtDetails = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-register-art-details/${auctionArtId}`, trimmedRegisterArtDetails);
  }

  // PUT /update-art-details/:auctionArtId
  updateArtDetails$(auctionArtId: string, form: FormGroup): Observable<any> {
    const trimmedArtDetails = this.#appService.trimObjectValues(form.value);

    return this.#http.put(`${this.#baseUrl}/auctions-cars/update-art-details/${auctionArtId}`, trimmedArtDetails);
  }
}
