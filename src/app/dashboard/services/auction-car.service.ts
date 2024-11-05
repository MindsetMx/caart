import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { AuctionCarInfo, ComingSoon, GetCarHistory } from '@dashboard/interfaces';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { AuctionTypes } from '@auctions/enums';

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

    return this.#http.put(`${this.#baseUrl}/car-history/car`, trimmedAddCarHistoryForm);
  }

  releaseCarForLiveAuction$(auctionCarId: string, startDate: string, endDate: string): Observable<any> {
    return this.#http.patch(`${this.#baseUrl}/auctions-cars/activate/${auctionCarId}`, { startDate, endDate });
  }

  // http://localhost:3000/car-history/car/{{originalAuctionCarId}}
  getCarHistory$(originalAuctionCarId: string): Observable<GetCarHistory> {
    return this.#http.get<GetCarHistory>(`${this.#baseUrl}/car-history/car/${originalAuctionCarId}`);
  }

  // http://localhost:3000/auctions-cars/toggle-coming-soon/originalID?type=art
  toggleComingSoon$(originalId: string, type: AuctionTypes): Observable<ComingSoon> {
    return this.#http.patch<ComingSoon>(`${this.#baseUrl}/auctions-cars/toggle-coming-soon/${originalId}?type=${type}`, {});
  }
}
