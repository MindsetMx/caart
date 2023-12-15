import { ElementRef, Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppService } from '../../app.service';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environments.baseUrl;
  private appService = inject(AppService);
  private http = inject(HttpClient);

  public registerUser(registerForm: FormGroup): Observable<any> {
    const body = this.appService.trimObjectValues(registerForm.value, ['password', 'password2']);

    return this.http.post(`${this.baseUrl}/users/register`, body);
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
