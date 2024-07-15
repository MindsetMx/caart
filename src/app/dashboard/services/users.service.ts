import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { Users } from '@dashboard/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getUsers$(page: number, size: number): Observable<Users> {
    return this.#http.get<any>(`${this.#baseUrl}/users?page=${page}&size=${size}&orderBy=1`);
  }

}
