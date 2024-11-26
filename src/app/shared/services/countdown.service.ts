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
    // return seconds >= 86400 ? 'd\'d\'' : 'HH:mm:ss';
    return seconds >= 86400 ? 'd\' Días\'' : 'HH:mm:ss';
  }

  getFormat2(seconds: number): string {
    // 02 horas, 35 minutos, 00 segundos
    return seconds >= 86400 ? 'd\' Días, \'H\' horas, \'m\' minutos, \'s\' segundos\'' : 'HH:mm:ss';
  }

  prettyText(secondsRemaining: number, text: string): string {
    if (secondsRemaining >= 86400) {
      const days = Math.floor(secondsRemaining / (24 * 60 * 60));
      return `${days} Día(s)`;
    }
    return text;
  }
}
