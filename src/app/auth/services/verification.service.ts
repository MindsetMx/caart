import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { UserData, ResendCode, VerifiedAccount } from '@auth/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  readonly #baseUrl = environments.baseUrl;

  #authService = inject(AuthService);
  #http = inject(HttpClient);

  get currentUser(): UserData | null {
    return this.#authService.currentUser();
  }

  confirmAccount$(code: string): Observable<VerifiedAccount> {
    const url = `${this.#baseUrl}/users/verify-code`;

    const body = {
      code,
      userId: this.currentUser?.id
    };

    return this.#http.post<VerifiedAccount>(url, body);
  }

  resendCode$(): Observable<ResendCode> {
    const url = `${this.#baseUrl}/users/resend-verification-code`;

    return this.#http.post<ResendCode>(url, { userId: this.currentUser?.id });
  }

  resendCodeToEmail$(): Observable<ResendCode> {
    const url = `${this.#baseUrl}/users/resend-verification-email`;

    return this.#http.post<ResendCode>(url, { userId: this.currentUser?.id });
  }
}
