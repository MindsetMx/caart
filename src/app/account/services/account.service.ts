import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  indexCurrentOption = signal<number>(0);
  numberOfOptions = signal(3);

  changeStep(step: number) {
    if (step < 0 || step >= this.numberOfOptions()) return;

    this.indexCurrentOption.set(step);
  }
}
