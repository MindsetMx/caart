import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'shared-input-error',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  @Input({ required: true }) message?: string;
}
