import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    PrimaryButtonDirective
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent { }
