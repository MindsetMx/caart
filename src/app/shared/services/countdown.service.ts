import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  getSecondsUntilEndDate(endDate: string): number {
    let now = new Date();
    let end = new Date(endDate);
    let difference = end.getTime() - now.getTime();

    return Math.floor(difference / 1000);
  }

  getFormat(seconds: number): string {
    return seconds >= 86400 ? 'd\'d\', H\'h\'' : 'HH:mm:ss';
  }

  getFormat2(seconds: number): string {
    // 02 horas, 35 minutos, 00 segundos
    return seconds >= 86400 ? 'd\' días, \'H\' horas, \'m\' minutos, \'s\' segundos\'' : 'HH:mm:ss';
  }
}
