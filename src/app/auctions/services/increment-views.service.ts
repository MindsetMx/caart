import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuctionTypes } from '@auctions/enums';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class IncrementViewsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // http://localhost:3000/views/increment
  //   {
  //     "itemId":"671ff79b8ce4a97871c1b488",
  //     "itemType":"car"
  // }
  incrementViews$(itemId: string, itemType: AuctionTypes): Observable<any> {
    return this.#http.post(`${this.#baseUrl}/views/increment`, {
      itemId,
      itemType
    });
  }
}
