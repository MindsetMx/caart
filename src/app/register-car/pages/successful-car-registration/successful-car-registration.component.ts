import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';

@Component({
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    TertiaryButtonDirective,
    RouterLink,
  ],
  templateUrl: './successful-car-registration.component.html',
  styleUrl: './successful-car-registration.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessfulCarRegistrationComponent { }
