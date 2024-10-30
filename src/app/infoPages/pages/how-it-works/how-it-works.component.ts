import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrimaryButtonDirective } from '@shared/directives';

@Component({
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    RouterLink,
  ],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent { }
