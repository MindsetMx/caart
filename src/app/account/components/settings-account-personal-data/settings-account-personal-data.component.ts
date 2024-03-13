import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalDataService } from '@app/account/services/personal-data.service';
import { AppService } from '@app/app.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { countries } from '@shared/countries';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'settings-account-personal-data',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './settings-account-personal-data.component.html',
  styleUrl: './settings-account-personal-data.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountPersonalDataComponent {
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #personalDataService = inject(PersonalDataService);
  #appService = inject(AppService);

  countries: string[] = countries;

  personalDataForm: FormGroup;

  personalDataSubmitButtonIsDisabled = signal<boolean>(false);

  constructor() {
    this.personalDataForm = this.#formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      sellerType: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });

    this.getUserInfo();
  }

  personalDataSubmit(): void {
    this.personalDataSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.personalDataForm);

    if (!isValid) {
      this.personalDataSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#personalDataService.updateUserInfo(this.personalDataForm.value).subscribe({
      next: (response) => {
        console.log('response', response);

        this.toastSuccess('Los datos personales se han actualizado correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.personalDataSubmitButtonIsDisabled.set(false);
    });
  }

  getUserInfo(): void {
    this.#personalDataService.getUserInfo().subscribe({
      next: (response) => {
        this.personalDataForm.patchValue(response.data.attributes);
      }
    });
  }

  hasError(field: string, form: FormGroup = this.personalDataForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.personalDataForm): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
