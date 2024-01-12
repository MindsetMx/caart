import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { Brands } from '../interfaces/brands';

@Injectable({
  providedIn: 'root'
})
export class RegisterCarService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  registerCar$(registerCar: FormGroup): Observable<any> {
    let trimmedRegisterCar = this.#appService.trimObjectValues(registerCar.value);

    const token = localStorage.getItem('token');

    if (!token) throw new Error('No token found');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = this.#appService.transformObjectToFormData(trimmedRegisterCar);

    return this.#http.post<any>(`${this.#baseUrl}/auction-items/register`, formData, { headers });
  }

  getBrands$(): Observable<Brands> {
    return this.#http.get<Brands>(`${this.#baseUrl}/car-brands`);
  }
}
