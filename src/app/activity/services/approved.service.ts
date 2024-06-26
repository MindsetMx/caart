import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprovedService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);


}
