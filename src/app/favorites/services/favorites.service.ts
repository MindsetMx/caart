import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { Favorites } from '@favorites/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // http://localhost:3000/auctions-cars/favorites?page=1&size=10&sort=asc&type=art
  getFavorites$(page: number, size: number, sort: string, type: string): Observable<Favorites> {
    return this.#http.get<Favorites>(`${this.#baseUrl}/auctions-cars/favorites?page=${page}&size=${size}&sort=${sort}&type=${type}`);
  }
}
