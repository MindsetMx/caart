import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  trimObjectValues(obj: any, passwordFields: string[] = []): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.trimObjectValues(item, passwordFields));
    } else if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (passwordFields.includes(key)) {
            result[key] = obj[key];
          } else {
            result[key] = this.trimObjectValues(obj[key], passwordFields);
          }
        }
      }
      return result;
    } else if (typeof obj === 'string') {
      return obj.trim();
    } else {
      return obj;
    }
  }
}
