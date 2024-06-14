import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from '@app/app.service';
import { Colors, Brands } from '@registerCarInterfaces/index';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class RegisterCarService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  registerCar$(registerCar: FormGroup): Observable<any> {
    console.log(registerCar.value);

    const trimmedRegisterCar = this.#appService.trimObjectValues(registerCar.value);

    trimmedRegisterCar.reserve = trimmedRegisterCar.reserve === 'true';

    const token = localStorage.getItem('token');

    if (!token) throw new Error('No token found');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.#http.post<any>(`${this.#baseUrl}/auction-items/register`, trimmedRegisterCar, { headers });
  }

  getColors$(): Observable<Colors[]> {
    return this.#http.get<Colors[]>(`${this.#baseUrl}/car-colors`);
  }

  getBrands$(): Observable<Brands> {
    return this.#http.get<Brands>(`${this.#baseUrl}/car-brands`);
  }
}
