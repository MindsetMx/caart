import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  // http://localhost:3000/followed-auctions/favorites?page=1&size=10&orderBy=1&type=any
  getFavorites$(page: number, size: number, orderBy: string, type: string): Observable<any> {
    return this.#http.get(`${this.#baseUrl}/followed-auctions/favorites?page=${page}&size=${size}&orderBy=${orderBy}&type=${type}`);
  }
}
