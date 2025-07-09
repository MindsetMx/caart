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

    trimmedFormGroup.reserve = trimmedFormGroup.reserve === 'true';

    trimmedFormGroup.photos = [
      'http://res.cloudinary.com/demo/image/upload/v1/exterior1.jpg',
      'http://res.cloudinary.com/demo/image/upload/v1/exterior2.jpg'
    ];
    trimmedFormGroup.videos = [
      'http://res.cloudinary.com/demo/image/upload/v1/exterior1.jpg'
    ];

    const url = `${this.#baseUrl}/auction-items/register-art`;

    return this.#http.post<any>(url, trimmedFormGroup);
  }
}
