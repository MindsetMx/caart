import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { FollowAuction } from '@auctions/interfaces/follow-auction';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuctionFollowService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  followAuction$(id: string, type: AuctionTypes = AuctionTypes.car): Observable<FollowAuction> {
    const url = `${this.#baseUrl}/followed-auctions/${type}/${id}`;

    return this.#http.post<FollowAuction>(url, {});
  }

  unfollowAuction$(id: string): Observable<FollowAuction> {
    const url = `${this.#baseUrl}/followed-auctions/${id}`;

    return this.#http.delete<FollowAuction>(url);
  }

}
