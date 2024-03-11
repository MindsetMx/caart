import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonDirective,
    TertiaryButtonDirective
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent { }
