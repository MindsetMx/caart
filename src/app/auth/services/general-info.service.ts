import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralInfo } from '@auth/interfaces/general-info';

@Injectable({
  providedIn: 'root'
})
export class GeneralInfoService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  getGeneralInfo$(): Observable<GeneralInfo> {
    const url = `${this.#baseUrl}/users/profile/general-info`;

    return this.#http.get<GeneralInfo>(url);
  }
}
