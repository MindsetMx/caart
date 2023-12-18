import { ElementRef, Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AppService } from '@app/app.service';
import { AuthStatus } from '@auth/enums';
import { CheckTokenResponse, RegisterResponse, loginResponse } from '@auth/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly #baseUrl = environments.baseUrl;
  #appService = inject(AppService);
  #http = inject(HttpClient);
  #fb = inject(FormBuilder);

  #currentUser = signal<string | null>(null);
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

  public checkAuthStatus(): Observable<boolean> {
    const url = `${this.#baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);


    return this.#http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ userId, token }) => this.setAuthentication(userId, token)),
        catchError(() => {
          this.#authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        })
      );
  }

  public login(loginForm: FormGroup): Observable<boolean> {
    const body = this.#appService.trimObjectValues(loginForm.value);

    return this.#http.post<loginResponse>(`${this.#baseUrl}/users/login`, body).pipe(
      tap((response) => console.log({ response })),
      map(({ userId, token }) => this.setAuthentication(userId, token)),
      catchError(() => throwError(() => 'Usuario o contraseña incorrectos.'))
    );
  }

  public logout() {
    localStorage.removeItem('token');
    this.#currentUser.set(null);
    this.#authStatus.set(AuthStatus.notAuthenticated);

  }

  private setAuthentication(userId: string, token: string): boolean {
    this.#currentUser.set(userId);
    this.#authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  public registerUser(registerForm: FormGroup): Observable<RegisterResponse> {
    const body = this.#appService.trimObjectValues(registerForm.value, ['password', 'password2']);

    return this.#http.post<RegisterResponse>(`${this.#baseUrl}/users/register`, body);
  }

  public toggleShowPassword(element: ElementRef<HTMLInputElement>, element2?: ElementRef<HTMLInputElement>): void {

    this.changeInputType(element);

    if (element2) {
      this.changeInputType(element2);
    }
  }

  public changeInputType(element: ElementRef<HTMLInputElement>): void {
    const input = element.nativeElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
