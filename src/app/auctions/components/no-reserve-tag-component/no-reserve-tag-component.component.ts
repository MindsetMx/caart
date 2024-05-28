import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'no-reserve-tag-component',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './no-reserve-tag-component.component.html',
  styleUrl: './no-reserve-tag-component.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoReserveTagComponentComponent { }
