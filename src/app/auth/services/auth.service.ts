import { ElementRef, Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { AppService } from '@app/app.service';
import { AuthStatus } from '@auth/enums';
import { CheckTokenResponse, UserData, RegisterResponse, loginResponse } from '@auth/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly #baseUrl = environments.baseUrl;
  #appService = inject(AppService);
  #http = inject(HttpClient);
  #fb = inject(FormBuilder);

  #currentUser = signal<UserData | null>(null);
  #authStatus = signal<AuthStatus>(AuthStatus.checking);

  currentUser = computed(() => this.#currentUser());
  authStatus = computed(() => this.#authStatus());

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.#fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  checkAuthStatus$(): Observable<boolean> {
    const url = `${this.#baseUrl}/users/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.#http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map((response: CheckTokenResponse) => {
          const user = response.data;
          const token = response.meta.token;

          return this.setAuthentication$(user, token)
        }),
        catchError(() => {
          this.#authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }

  login$(loginForm: FormGroup): Observable<boolean> {
    const body = this.#appService.trimObjectValues(loginForm.value);

    return this.#http.post<loginResponse>(`${this.#baseUrl}/users/login`, body).pipe(
      map((response: loginResponse) => {
        const user = response.data;
        const token = response.meta.token;

        return this.setAuthentication$(user, token)
      }),
      catchError(() => throwError(() => 'Usuario o contraseña incorrectos.'))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.#currentUser.set(null);
    this.#authStatus.set(AuthStatus.notAuthenticated);

  }

  private setAuthentication$(user: UserData, token: string): boolean {
    this.#currentUser.set(user);
    this.#authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  registerUser$(registerForm: FormGroup): Observable<RegisterResponse> {
    let registerFormValue = registerForm.value;
    if (registerFormValue.prefix)
      registerFormValue.phoneNumber = `${registerFormValue.prefix}${registerFormValue.phoneNumber}`;
    delete registerFormValue.prefix;
    delete registerFormValue.password2;
    registerFormValue = this.#appService.trimObjectValues(registerForm.value, ['password']);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    const formData = this.#appService.transformObjectToFormData(registerFormValue);

    return this.#http.post<RegisterResponse>(`${this.#baseUrl}/users/register`, formData, { headers });
  }

  completeRegister$(completeRegisterForm: FormGroup): Observable<any> {
    const trimmedCompleteRegisterForm = this.#appService.trimObjectValues(completeRegisterForm.value);
    const formData = this.#appService.transformObjectToFormData(trimmedCompleteRegisterForm);

    const token = localStorage.getItem('token');

    if (!token) throw new Error('No token found');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.#http.post<any>(`${this.#baseUrl}/users/complete-registration`, formData, { headers });
  }

  toggleShowPassword(element: ElementRef<HTMLInputElement>, element2?: ElementRef<HTMLInputElement>): void {
    this.changeInputType(element);

    if (element2) {
      this.changeInputType(element2);
    }
  }

  changeInputType(element: ElementRef<HTMLInputElement>): void {
    const input = element.nativeElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
