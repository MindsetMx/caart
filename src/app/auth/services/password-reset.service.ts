import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  requestPasswordReset$(email: string): Observable<any> {
    return this.#http.post(`${this.#baseUrl}/users/request-password-reset`, { email });
  }

  resetPassword$(token: string, newPassword: string): Observable<any> {
    return this.#http.post(`${this.#baseUrl}/users/reset-password`, { token, newPassword });
  }
}
