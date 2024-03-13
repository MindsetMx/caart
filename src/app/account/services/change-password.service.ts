import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  readonly #baseUrl = environments.baseUrl;

  http = inject(HttpClient);

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.patch<any>(`${this.#baseUrl}/users/change-password`, data);
  }
}
