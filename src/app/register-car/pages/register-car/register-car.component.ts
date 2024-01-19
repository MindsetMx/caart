import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, WritableSignal, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, Subscription, catchError, map } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule, UppyAngularDragDropModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppComponent } from '@app/app.component';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { RegisterCarService } from '@app/register-car/services/register-car.service';
import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { SubastaAutomovilesTypes } from '@app/register-car/enums/subastaAutomovilesTypes.enum';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { UserData } from '@auth/interfaces';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'register-car',
  standalone: true,
  imports: [
    CommonModule,
    CompleteRegisterModalComponent,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SecondaryButtonDirective,
    SpinnerComponent,
    TabsWithIconsComponent,
    UppyAngularDashboardModule,
    UppyAngularDragDropModule,
  ],
  templateUrl: './register-car.component.html',
  styleUrl: './register-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uppyDashboard') uppyDashboard!: ElementRef;

  #appComponent = inject(AppComponent);
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #generalInfoService = inject(GeneralInfoService);
  #registerCarService = inject(RegisterCarService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  tabs: TabWithIcon[];
  currentTab: WritableSignal<TabWithIcon> = signal<TabWithIcon>({} as TabWithIcon);
  currentSubastaAutomovilesType: WritableSignal<SubastaAutomovilesTypes> = signal<SubastaAutomovilesTypes>(SubastaAutomovilesTypes.AUTOMOVILES);
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  brands: WritableSignal<string[]> = signal([]);
  currentYear = new Date().getFullYear();
  carRegisterForm: FormGroup;
  reserveValueChangesSubscription?: Subscription;
  completeRegisterModalIsOpen: WritableSignal<boolean> = signal(false);

  uppy?: Uppy;

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get subastaAutomovilesType(): typeof SubastaAutomovilesTypes {
    return SubastaAutomovilesTypes;
  }

  get reserveControl(): FormControl {
    return this.carRegisterForm.get('reserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.carRegisterForm.get('reserveAmount') as FormControl;
  }

  get userIsNotAuthenticated(): boolean {
    return this.authStatus === AuthStatus.notAuthenticated;
  }

  get photosControl(): FormControl {
    return this.carRegisterForm.get('photos') as FormControl;
  }

  constructor() {
    this.carRegisterForm = this.#fb.group({
      type: ['automobile', Validators.required],
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1930), Validators.max(2024)]],
      carModel: ['', Validators.required],
      exteriorColor: ['', Validators.required],
      interiorColor: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      reserve: [null, Validators.required],
      reserveAmount: [null],
      kmType: ['', Validators.required],
      kmInput: ['', Validators.required],
      howDidYouHearAboutUs: ['', Validators.required],
      interest: ['', Validators.required],
      acceptTerms: ['', Validators.required],
      photos: [[], Validators.required],
    });

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
      ];

    this.currentTab.set(this.tabs[0]);
  }
  ngAfterViewInit(): void {
    this.uppy = new Uppy({
      debug: true,
      autoProceed: true,
      locale: Spanish,
      meta: { // Metadatos globales para todos los archivos
        upload_preset: 'if8y72iv', // Asegúrate de poner aquí tu upload preset real
        api_key: '218199524155838', // Asegúrate de poner aquí tu api key real
      }
    }).use(Dashboard,
      {
        // theme: 'dark',
        height: 300,
        hideUploadButton: true,
        hideCancelButton: true,
        showRemoveButtonAfterComplete: true,
        inline: true,
        // showProgressDetails: false,
        hideProgressAfterFinish: true,
        target: this.uppyDashboard.nativeElement,
        proudlyDisplayPoweredByUppy: true,
        locale: {
          strings: {
            dropPasteFiles: 'Arrastra y suelta tus fotos aquí o %{browse}',
          }
        }
      })
      .use(XHRUpload, {
        endpoint: 'https://api.cloudinary.com/v1_1/dv7skd1y3/image/upload',
        formData: true,
        fieldName: 'file',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        allowedMetaFields: ['upload_preset', 'api_key'], // Añadir campos meta aquí
      })
      .on('complete', (result) => {
        console.log({ result });
        result.successful.forEach(file => {
          const url = file.uploadURL; // Asumiendo que la respuesta incluye la URL de la imagen cargada
          //Agregar la url al photosControl de fotos sin eliminar las fotos anteriores
          this.photosControl.setValue([...this.photosControl.value, url]);

          this.uppyDashboard.nativeElement.click();

          file.meta['uploadURL'] = url; // Almacena la URL en los metadatos del archivo en Uppy para referencia futura
        });
      }).on('file-removed', (file, reason) => {
        console.log(`File removed: ${file.id}`);
        console.log(`Reason: ${reason}`);
        const urlToRemove = file.meta['uploadURL']; // Obtiene la URL del archivo eliminado de sus metadatos
        // Elimina la URL del formArray de fotos
        this.photosControl.setValue(this.photosControl.value.filter((url: string) => url !== urlToRemove));
      });
  }

  ngOnInit(): void {
    this.getBrands();

    this.reserveValueChangesSubscription = this.reserveControl.valueChanges.subscribe((value) => {
      if (value === '1') {
        this.reserveAmountControl.setValidators([Validators.required]);
      } else {
        this.reserveAmountControl.clearValidators();
      }

      this.carRegisterForm.updateValueAndValidity();
    });
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  openRegisterModal(): void {
    this.#appComponent.openRegisterModal();
  }

  ngOnDestroy(): void {
    this.reserveValueChangesSubscription?.unsubscribe();
  }

  registerCar(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carRegisterForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    console.log({ carRegisterForm: this.carRegisterForm.value });

    this.#registerCarService.registerCar$(this.carRegisterForm).subscribe({
      next: (response) => {
        console.log({ response });

        this.carRegisterForm.reset();

        this.#router.navigate(['/registro-exitoso']);
      },
      error: (error) => {
        console.error({ error });
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });

  }

  showModalBasedOnUserStatus(): void {
    if (this.userIsNotAuthenticated) {
      this.#appComponent.openSignInModal();
      return;
    }


    this.#generalInfoService.getGeneralInfo$().subscribe({
      next: (response) => {
        const hasGeneralInfo = response.data.attributes.hasGeneralInfo;

        if (!hasGeneralInfo) {
          this.completeRegisterModalIsOpen.set(true);
        }
      },
      error: (error) => {
        console.error({ error });
      }
    });
  }

  hasGeneralInfo$ = this.#generalInfoService.getGeneralInfo$().pipe(
    map(response => {
      return response.data.attributes.hasGeneralInfo;
    }),
    catchError((error) => {
      console.error({ error });

      return EMPTY;
    })
  );

  getBrands(): void {
    this.#registerCarService.getBrands$().subscribe({
      next: (response) => {
        this.brands.set(response.data);
      },
      error: (error) => {
        console.error({ error });
      }
    });
  }

  setSubastaAutomovilesType(type: SubastaAutomovilesTypes): void {
    this.currentSubastaAutomovilesType.set(type);
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.carRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.carRegisterForm) return undefined;

    return this.#validatorsService.getError(this.carRegisterForm, field);
  }
}
