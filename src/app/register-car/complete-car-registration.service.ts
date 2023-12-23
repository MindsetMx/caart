import { Injectable } from '@angular/core';
import { GeneralInformationComponent } from './components/general-information/general-information.component';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  steps = [GeneralInformationComponent];

  indexCurrentStep: number = 0;
}
