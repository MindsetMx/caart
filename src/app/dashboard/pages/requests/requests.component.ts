import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ArtRequestsComponent } from '@dashboard/components/art-requests/art-requests.component';
import { InputDirective } from '@shared/directives';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { TypesOfRequests } from '@dashboard/enums';
import { VehicleRequestsComponent } from '@dashboard/components/vehicle-requests/vehicle-requests.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
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
  requestType: FormControl = new FormControl(TypesOfRequests.Car);

  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  get typesOfRequests(): typeof TypesOfRequests {
    return TypesOfRequests;
  }

  constructor() {
    this.#activatedRoute.queryParams.
      pipe(
        takeUntilDestroyed(),
      ).subscribe(params => {
        let type: TypesOfRequests = params['type'];

        if (!(type in TypesOfRequests)) {
          type = TypesOfRequests.Car;
        }

        this.requestType.setValue(type);
      });

    this.requestType.valueChanges.
      pipe(
        takeUntilDestroyed(),
      ).subscribe((value: TypesOfRequests) => {
        this.#router.navigate([], {
          queryParams: { type: value },
          queryParamsHandling: 'merge'
        });
      });
  }
}
