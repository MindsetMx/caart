import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    InputDirective,
    PrimaryButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  contactForm: FormGroup;

  contactButtonIsDisabled = signal(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);

  constructor() {
    this.contactForm = this.#formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    });
  }

  contactFormSubmit() {

  }

  hasError(field: string, formGroup: FormGroup = this.contactForm): boolean {
    return this.#validatorsService.hasError(formGroup, field);
  }

  getError(field: string, formGroup: FormGroup = this.contactForm): string | undefined {
    return this.#validatorsService.getError(formGroup, field);
  }
}
