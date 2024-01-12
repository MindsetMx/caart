import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralInfo } from '@auth/interfaces/general-info';

@Injectable({
  providedIn: 'root'
})
export class GeneralInfoService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  generalInfo$(): Observable<GeneralInfo> {
    const url = `${this.#baseUrl}/users/profile/general-info`;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })

    return this.#http.get<GeneralInfo>(url, { headers });
  }
}
