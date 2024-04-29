import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { AuctionService } from '@app/auctions/services/auction.service';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { PublicationRequestsData } from '@app/auctions/interfaces/publication-requests';
import { InputDirective } from '@shared/directives';
import { RequestsDetailsModalComponent } from '@app/dashboard/modals/requests-details-modal/requests-details-modal.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TypesOfRequests } from '@app/dashboard/enums';
import { VehicleRequestsComponent } from '@app/dashboard/components/vehicle-requests/vehicle-requests.component';
import { ArtRequestsComponent } from '@app/dashboard/components/art-requests/art-requests.component';

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
