import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { BatchToken, UploadImageDirect } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryCroppedImageService {
  #http = inject(HttpClient);

  uploadImage$(image: File, url: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', image, image.name);

    return this.#http.post<any>(url, formData);
  }

  uploadImageDirect$(): Observable<UploadImageDirect> {
    const form = new FormData();
    form.append("requireSignedURLs", "false");

    return this.#http.post<UploadImageDirect>('https://caart.com.mx/back/auctions-cars/get-url-image', form);
  }

  batchTokenDirect$(): Observable<BatchToken> {
    return this.#http.get<BatchToken>('https://caart.com.mx/back/auctions-cars/batch-token');
  }
}
