import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputDirective } from '@shared/directives';
import { PublishCarsComponent } from '@dashboard/components/publish-cars/publish-cars.component';
import { TypesOfRequests } from '@dashboard/enums';
import { PublishArtComponent } from '@dashboard/components/publish-art/publish-art.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
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
