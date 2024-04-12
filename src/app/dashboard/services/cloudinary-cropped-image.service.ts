import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '@env/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryCroppedImageService {
  cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dv7skd1y3/upload';
  uploadPreset = 'if8y72iv';

  #http = inject(HttpClient);

  // uploadImage$(base64Image: string): Observable<any> {
  //   const pureBase64Data = base64Image.split(',')[1];

  //   console.log({ pureBase64Data });

  //   const formData = new FormData();
  //   formData.append('file', pureBase64Data);
  //   formData.append('upload_preset', this.uploadPreset);

  //   const headers = new HttpHeaders({
  //     'X-Requested-With': 'XMLHttpRequest',
  //   });

  //   return this.#http.post(this.cloudinaryUrl, formData, { headers });
  // }

  uploadImage$(formData: FormData): Observable<any> {
    return this.#http.post(this.cloudinaryUrl, formData);
  }
}
