import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ArtWizard } from '@dashboard/interfaces';
import { ArtWizardService } from '@dashboard/services/art-wizard.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Rarity } from '@app/art/enum/rarity.enum';
import { startWith, map, Observable } from 'rxjs';
import { states } from '@shared/states';
import { ValidatorsService } from '@shared/services/validators.service';
import { AppService } from '@app/app.service';
import { UpdateAuctionArtDetailsService } from '@dashboard/services/update-auction-art-details.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'auction-art-register-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './auction-art-register-details.component.html',
  styleUrl: './auction-art-register-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtRegisterDetailsComponent {
  auctionArtId = input.required<string>();
  wizardData = input.required<ArtWizard>();

  #formBuilder = inject(FormBuilder);
  #sanitizer = inject(DomSanitizer);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);
  #updateAuctionArtDetailsService = inject(UpdateAuctionArtDetailsService);

  filteredStates?: Observable<string[]>;

  registerArtForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);
  rarities = signal<Rarity[]>(Object.values(Rarity));

  get reserveControl(): FormControl {
    return this.registerArtForm.get('reserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.registerArtForm.get('reserveAmount') as FormControl;
  }

  get rarityControl(): FormControl {
    return this.registerArtForm.get('rarity') as FormControl
  }

  get editionControl(): FormControl {
    return this.registerArtForm.get('edition') as FormControl;
  }

  get stateControl(): FormControl {
    return this.registerArtForm.get('state') as FormControl;
  }

  get categoryControl(): FormControl {
    return this.registerArtForm.get('category') as FormControl;
  }

  get rarity(): typeof Rarity {
    return Rarity;
  }

  private _filterStates(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return states.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  constructor() {
    this.registerArtForm = this.#formBuilder.group({
      artist: ['', [Validators.required]],
      title: ['', [Validators.required]],
      year: ['', [Validators.required]],
      materials: ['', [Validators.required]],
      category: ['', [Validators.required]],
      otherCategory: [''],
      rarity: ['', [Validators.required]],
      edition: [''],
      height: ['', [Validators.required]],
      width: ['', [Validators.required]],
      depth: [''],
      unit: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      reserve: ['', [Validators.required]],
      reserveAmount: ['', [Validators.required]],
      photos: [[], [Validators.required]],
      videos: [[]],
      // interest: ['', Validators.required],
      // acceptTerms: ['', [Validators.required]],
    });

    this.reserveControl.valueChanges.pipe(
      takeUntilDestroyed(),
    ).subscribe((value) => {
      if (value === 'true') {
        this.reserveAmountControl.setValue(this.wizardData().data.registerArtDetails.reserveAmount);
        this.reserveAmountControl.setValidators([Validators.required]);
      } else {
        this.reserveAmountControl.setValue('');
        this.reserveAmountControl.clearValidators();
      }

      this.reserveAmountControl.updateValueAndValidity();
    });

    this.rarityControl.valueChanges.pipe(
      takeUntilDestroyed(),
    ).subscribe((value) => {
      if (value === Rarity.LimitedEdition) {
        this.editionControl.setValue(this.wizardData().data.registerArtDetails.edition);
        this.editionControl.setValidators([Validators.required]);
      } else {
        this.editionControl.setValue('');
        this.editionControl.clearValidators();
      }

      this.editionControl.updateValueAndValidity();
    });

    this.filteredStates = this.stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || '')),
    );
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.registerArtForm.reset();

      const registerArtDetails = this.wizardData().data.registerArtDetails;
      this.registerArtForm.patchValue({
        artist: registerArtDetails.artist,
        title: registerArtDetails.title,
        year: registerArtDetails.year,
        materials: registerArtDetails.materials,
        category: registerArtDetails.category,
        otherCategory: registerArtDetails.otherCategory,
        rarity: registerArtDetails.rarity,
        edition: registerArtDetails.edition,
        height: registerArtDetails.height,
        width: registerArtDetails.width,
        depth: registerArtDetails.depth,
        unit: registerArtDetails.unit,
        condition: registerArtDetails.condition,
        city: registerArtDetails.city,
        state: registerArtDetails.state,
        postalCode: registerArtDetails.postalCode,
        reserve: registerArtDetails.reserve,
        reserveAmount: registerArtDetails.reserveAmount,
        photos: registerArtDetails.photos,
        videos: registerArtDetails.videos,
        // interest: registerArtDetails.interest,
        // acceptTerms: registerArtDetails.acceptTerms,
      });
    }
  });

  updateRegisterArtDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.registerArtForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionArtDetailsService.updateRegisterArtDetails$(this.auctionArtId(), this.registerArtForm).subscribe({
      next: () => {
        this.toastSuccess('Registro actualizado exitosamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string, form: FormGroup = this.registerArtForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.registerArtForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }
}
