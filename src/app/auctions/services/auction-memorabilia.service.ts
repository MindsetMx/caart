import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuctionMemorabiliaPublications } from '@auctions/interfaces';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuctionMemorabiliaService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  auctionMemorabilia$(): Observable<AuctionMemorabiliaPublications> {
    const url = `${this.#baseUrl}/auction-items/auction-memorabilia`;

    return this.#http.get<AuctionMemorabiliaPublications>(url);
  }

  // auction-items/auction-memorabilia-publishes
  getMemorabiliaPublications$(): Observable<any> {
    const url = `${this.#baseUrl}/auction-items/auction-memorabilia-publishes`;

    return this.#http.get<any>(url);
  }
}
