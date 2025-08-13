import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ArtPublicationsComponent } from '@dashboard/components/art-publications/art-publications.component';
import { VehiclePublicationsComponent } from '@dashboard/components/vehicle-publications/vehicle-publications.component';
import { TypesOfRequests } from '@dashboard/enums';
import { InputDirective } from '@shared/directives';

@Component({
  standalone: true,
  imports: [
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
  publicationType: FormControl = new FormControl(TypesOfRequests.Car);

  get typesOfPublications(): typeof TypesOfRequests {
    return TypesOfRequests;
  }
}
