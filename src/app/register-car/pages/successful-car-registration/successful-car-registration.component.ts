import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';

@Component({
  selector: 'app-successful-car-registration',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    TertiaryButtonDirective
  ],
  templateUrl: './successful-car-registration.component.html',
  styleUrl: './successful-car-registration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessfulCarRegistrationComponent { }
