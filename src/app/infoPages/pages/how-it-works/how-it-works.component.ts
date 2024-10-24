import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimaryButtonDirective } from '@shared/directives';

@Component({
  standalone: true,
  imports: [
    PrimaryButtonDirective
  ],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent { }
