import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-star',
  standalone: true,
  templateUrl: './star.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarComponent {
  @Input() classes?: string;
}
