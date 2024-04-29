import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterArtService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);
  #appService = inject(AppService);

  registerArt$(formGroup: FormGroup): Observable<any> {
    const trimmedFormGroup = this.#appService.trimObjectValues(formGroup.value);

    const url = `${this.#baseUrl}/auction-items/register-art`;

    return this.#http.post<any>(url, trimmedFormGroup);
  }
}
