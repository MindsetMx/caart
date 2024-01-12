import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';

@Component({
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    TertiaryButtonDirective
  ],
  templateUrl: './successful-register-request.component.html',
  styleUrl: './successful-register-request.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessfulRegisterRequestComponent { }
