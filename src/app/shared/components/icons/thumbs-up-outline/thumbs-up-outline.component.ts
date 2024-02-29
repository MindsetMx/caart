import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'thumbs-up-outline',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './thumbs-up-outline.component.html',
  styleUrl: './thumbs-up-outline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbsUpOutlineComponent {
  shouldFill = input<boolean>(false);
}
