import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CompletedAuctions } from '@auctions/interfaces/completed-auctions';

import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletedAuctionsService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getCompletedAuctions$(): Observable<CompletedAuctions> {
    const url = `${this.#baseUrl}/auctions-cars/completed`;

    return this.#http.get<CompletedAuctions>(url);
  }
}
