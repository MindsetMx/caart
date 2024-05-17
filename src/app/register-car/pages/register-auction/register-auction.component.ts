import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppComponent } from '@app/app.component';
import { ArtRegisterComponent } from '@app/art/components/art-register/art-register.component';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { Brands, Colors } from '@app/register-car/interfaces';
import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
import { environments } from '@env/environments';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { RegisterCarService } from '@app/register-car/services/register-car.service';
import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { states } from '@shared/states';
import { SubastaAutomovilesTypes } from '@app/register-car/enums/subastaAutomovilesTypes.enum';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { ValidatorsService } from '@shared/services/validators.service';
import { VehicleMemorabiliaComponentComponent } from '@app/register-car/components/vehicle-memorabilia-component/vehicle-memorabilia-component.component';
import { NgxMaskDirective } from 'ngx-mask';
import { CarRegisterComponent } from '@app/art/components/car-register/car-register.component';

@Component({
  selector: 'register-car',
  standalone: true,
  imports: [
    TabsWithIconsComponent,
    VehicleMemorabiliaComponentComponent,
    ArtRegisterComponent,
    CarRegisterComponent
  ],
  templateUrl: './register-auction.component.html',
  styleUrl: './register-auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterAuctionComponent {
  currentTab = signal<TabWithIcon>({} as TabWithIcon);
  tabs: TabWithIcon[];

  constructor() {
    this.tabs =
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
        {
          id: 3,
          name: 'Memorabilia',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        }
      ];

    this.currentTab.set(this.tabs[0]);
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);
  }
}
