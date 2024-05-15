import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sell-with-us',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sell-with-us.component.html',
  styleUrl: './sell-with-us.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellWithUsComponent { }
