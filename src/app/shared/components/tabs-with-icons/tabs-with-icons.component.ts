import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  selector: 'shared-tabs-with-icons',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tabs-with-icons.component.html',
  styleUrl: './tabs-with-icons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsWithIconsComponent {
  @Input({ required: true }) tabs!: TabWithIcon[];
  @Input() px: string = 'md:px-16';
  @Input() justify: string = 'justify-center';
  @Output() tabSelected: EventEmitter<TabWithIcon> = new EventEmitter<TabWithIcon>();

  changeTab(tab: TabWithIcon): void {
    this.tabs.forEach((element, index) => {
      this.tabs[index].current = (element.id === tab.id) ? true : false;
    });

    this.tabSelected.emit(tab);
  }
}
