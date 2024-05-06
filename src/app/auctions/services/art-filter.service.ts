import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ArtAuction } from '@auctions/interfaces/art-auction';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtFilterService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getLiveAuctions$(
    page: number,
    size: number,
    auctionType: string = 'any',
  ): Observable<ArtAuction> {
    const url = `${this.#baseUrl}/auctions-cars/live-auctions-art`;

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (auctionType) { params = params.set('type', auctionType); }

    return this.#http.get<ArtAuction>(url, { params });
  }

}
