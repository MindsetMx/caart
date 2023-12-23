import { Injectable } from '@angular/core';
import { GeneralInformationComponent } from './components/general-information/general-information.component';

@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  steps = [GeneralInformationComponent];

  indexCurrentStep: number = 0;
}
