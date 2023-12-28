import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'shared-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent { }
