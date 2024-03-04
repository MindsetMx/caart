import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleMemorabiliaService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  registerMemorabilia$(registerMemorabilia: FormGroup): Observable<any> {
    const trimmedRegisterMemorabilia = this.#appService.trimObjectValues(registerMemorabilia.value);

    return this.#http.post<any>(`${this.#baseUrl}/auction-items/register-memorabilia`, trimmedRegisterMemorabilia);
  }
}
