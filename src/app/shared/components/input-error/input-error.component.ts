import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-input-error',
  standalone: true,
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  @Input({ required: true }) message?: string;
}
