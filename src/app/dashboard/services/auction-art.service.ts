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

  dashboardInfo$(page: number = 1, size: number = 1000, orderBy: string = 'created', orderDirection: number = -1): Observable<AuctionArtInfo> {
    return this.#http.get<AuctionArtInfo>(`${this.#baseUrl}/auctions-cars/dashboard-info-art?page=${page}&size=${size}&orderBy=${orderBy}&orderDirection=${orderDirection}`);
  }

  addArtHistory$(addArtHistoryForm: FormGroup): Observable<any> {
    const trimmedAddArtHistoryForm = this.#appService.trimObjectValues(addArtHistoryForm.value);

    return this.#http.put(`${this.#baseUrl}/car-history/art`, trimmedAddArtHistoryForm);
  }

  releaseArtForLiveAuction$(auctionArtId: string, startDate: string, endDate: string): Observable<any> {
    // auctions-cars/activate-art/6670cd726819beabe0985141
    return this.#http.patch(`${this.#baseUrl}/auctions-cars/activate-art/${auctionArtId}`, { startDate, endDate });
  }

  // http://localhost:3000/car-history/art/{{originalAuctionArtId}}
  getArtHistory$(originalAuctionArtId: string): Observable<any> {
    return this.#http.get(`${this.#baseUrl}/car-history/art/${originalAuctionArtId}`);
  }
}
