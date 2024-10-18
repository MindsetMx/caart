import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  requestType: FormControl = new FormControl(TypesOfRequests.Car);

  page1 = signal<number>(1);
  size1 = signal<number>(10);
  page2 = signal<number>(1);
  size2 = signal<number>(10);

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

        switch (type) {
          case TypesOfRequests.Car:
            const page1 = params['page1'];
            const size1 = params['size1'];

            if (page1) this.page1.set(+page1);
            if (size1) this.size1.set(+size1);
            break;
          case TypesOfRequests.Art:
            const page2 = params['page2'];
            const size2 = params['size2'];

            if (page2) this.page2.set(+page2);
            if (size2) this.size2.set(+size2);
            break;
        }
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
