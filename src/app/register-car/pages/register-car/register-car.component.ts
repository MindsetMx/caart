import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from '@angular/core';

import { InputDirective } from '@shared/directives/input.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { SubastaAutomovilesTypes } from '../../enums/SubastaAutomovilesTypes.enum';

@Component({
  selector: 'register-car',
  standalone: true,
  imports: [
    TabsWithIconsComponent,
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    InputDirective
  ],
  templateUrl: './register-car.component.html',
  styleUrl: './register-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCarComponent implements OnInit {
  tabs: WritableSignal<TabWithIcon[]> = signal<TabWithIcon[]>([]);
  currentTab: WritableSignal<TabWithIcon> = signal<TabWithIcon>({} as TabWithIcon);
  currentSubastaAutomovilesType: WritableSignal<SubastaAutomovilesTypes> = signal<SubastaAutomovilesTypes>(SubastaAutomovilesTypes.AUTOMOVILES);

  get subastaAutomovilesType(): typeof SubastaAutomovilesTypes {
    return SubastaAutomovilesTypes;
  }

  ngOnInit(): void {
    this.tabs.set(
      [
        {
          id: 1,
          name: 'Automóviles',
          img: 'assets/img/registrar auto/car-sport-outline.svg',
          current: true
        },
        {
          id: 2,
          name: 'Arte',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        },
      ]
    );

    this.currentTab.set(this.tabs()[0]);
  }

  setSubastaAutomovilesType(type: SubastaAutomovilesTypes): void {
    this.currentSubastaAutomovilesType.set(type);
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);
  }
}
