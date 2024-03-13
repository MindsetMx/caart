import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environments } from '@env/environments';
import { PersonalData } from '@account/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  readonly #baseUrl = environments.baseUrl;

  http = inject(HttpClient);

  getUserInfo(): Observable<PersonalData> {
    return this.http.get<PersonalData>(`${this.#baseUrl}/users/get-user-info`);
  }

  updateUserInfo(data: PersonalData): Observable<PersonalData> {
    return this.http.patch<PersonalData>(`${this.#baseUrl}/users/update-info`, data);
  }

}
