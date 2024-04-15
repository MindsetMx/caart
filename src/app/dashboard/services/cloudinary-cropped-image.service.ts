import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';
import { UploadCroppedImage } from '@app/dashboard/interfaces/upload-cropped-image';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryCroppedImageService {
  readonly #cloudflareApiUrl = environments.cloudflareApiUrl;
  readonly #cloudflareToken = environments.cloudfareToken;

  #http = inject(HttpClient);

  uploadImage$(image: Blob | null): Observable<UploadCroppedImage> {
    const formData = new FormData();
    formData.append('file', image as Blob);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.#cloudflareToken}`
    });

    return this.#http.post<UploadCroppedImage>(this.#cloudflareApiUrl, formData, { headers });
  }
}
