import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputDirective } from '@shared/directives';
import { PublishCarsComponent } from '@app/dashboard/components/publish-cars/publish-cars.component';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { TypesOfRequests } from '@app/dashboard/enums';
import { PublishArtComponent } from '@app/dashboard/components/publish-art/publish-art.component';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    ReactiveFormsModule,
    PublishCarsComponent,
    InputDirective,
    PublishArtComponent
  ],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishComponent {
  requestType: FormControl = new FormControl(TypesOfRequests.Art);

  get typesOfRequests(): typeof TypesOfRequests {
    return TypesOfRequests;
  }
}
