import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionCarInfo } from '@dashboard/interfaces';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionCarService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  dashboardInfo$(page: number = 1, size: number = 5, orderBy: string = 'brand', orderDirection: number = 1): Observable<AuctionCarInfo> {
    return this.#http.get<AuctionCarInfo>(`${this.#baseUrl}/auctions-cars/dashboard-info?page=${page}&size=${size}&orderBy=${orderBy}&orderDirection=${orderDirection}`);
  }

  addCarHistory$(addCarHistoryForm: FormGroup): Observable<any> {
    const trimmedAddCarHistoryForm = this.#appService.trimObjectValues(addCarHistoryForm.value);

    return this.#http.post(`${this.#baseUrl}/car-history`, trimmedAddCarHistoryForm);
  }

  releaseCarForLiveAuction$(auctionCarId: string, startDate: string, endDate: string): Observable<any> {
    return this.#http.patch(`${this.#baseUrl}/auctions-cars/activate/${auctionCarId}`, { startDate, endDate });
  }
}
