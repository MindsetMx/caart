import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BatchToken, UploadImageDirect } from '@dashboard/interfaces';
import { environments } from '@env/environments';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryCroppedImageService {
  readonly #baseUrl = environments.baseUrl;

  #http = inject(HttpClient);

  uploadImage$(image: File, url: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', image, image.name);

    return this.#http.post<any>(url, formData);
  }

  uploadImageDirect$(): Observable<UploadImageDirect> {
    const form = new FormData();
    form.append("requireSignedURLs", "false");

    return this.#http.post<UploadImageDirect>(`${this.#baseUrl}/auctions-cars/get-url-image`, form);
  }

  batchTokenDirect$(): Observable<BatchToken> {
    return this.#http.get<BatchToken>(`${this.#baseUrl}/auctions-cars/batch-token`);
  }
}
