import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuctionCarPublicationsData } from '@app/auctions/interfaces/auction-car-publishes';
import { AuctionService } from '@app/auctions/services/auction.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { TypesOfRequests } from '@app/dashboard/enums';
import { InputDirective } from '@shared/directives';
import { VehiclePublicationsComponent } from '@app/dashboard/components/vehicle-publications/vehicle-publications.component';
import { ArtPublicationsComponent } from '@app/dashboard/components/art-publications/art-publications.component';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    ReactiveFormsModule,
    InputDirective,
    VehiclePublicationsComponent,
    ArtPublicationsComponent
  ],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent {
  publicationType: FormControl = new FormControl(TypesOfRequests.Art);

  get typesOfPublications(): typeof TypesOfRequests {
    return TypesOfRequests;
  }
}
