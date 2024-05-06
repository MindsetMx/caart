import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ArtRequestsComponent } from '@dashboard/components/art-requests/art-requests.component';
import { InputDirective } from '@shared/directives';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { TypesOfRequests } from '@dashboard/enums';
import { VehicleRequestsComponent } from '@dashboard/components/vehicle-requests/vehicle-requests.component';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    SidebarComponent,
    InputDirective,
    ReactiveFormsModule,
    VehicleRequestsComponent,
    ArtRequestsComponent
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent {
  requestType: FormControl = new FormControl(TypesOfRequests.Art);

  get typesOfRequests(): typeof TypesOfRequests {
    return TypesOfRequests;
  }
}
