import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivityTabs } from '@activity/enums/activityTabs.enum';
import { PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';
import { MatIcon } from '@angular/material/icon';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'activity',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  currentActivityTab = signal<ActivityTabs>(ActivityTabs.requests);


  get activityTabs(): typeof ActivityTabs {
    return ActivityTabs;
  }

  setActivityTab(tab: ActivityTabs): void {
    this.currentActivityTab = signal(tab);
  }
}
