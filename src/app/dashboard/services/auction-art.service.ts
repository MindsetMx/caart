import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionArtInfo } from '@dashboard/interfaces';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuctionArtService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  dashboardInfo$(page: number = 1, size: number = 1000, orderBy: string = 'created', published: boolean = false, orderDirection: number = -1): Observable<AuctionArtInfo> {
    return this.#http.get<AuctionArtInfo>(`${this.#baseUrl}/auctions-cars/dashboard-info-art?page=${page}&size=${size}&orderBy=${orderBy}&published=${published}&orderDirection=${orderDirection}`);
  }

  addArtHistory$(addArtHistoryForm: FormGroup): Observable<any> {
    const trimmedAddArtHistoryForm = this.#appService.trimObjectValues(addArtHistoryForm.value);

    return this.#http.post(`${this.#baseUrl}/car-history/art`, trimmedAddArtHistoryForm);
  }
}
