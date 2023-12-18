import { ChangeDetectionStrategy, Component, WritableSignal, signal, inject, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    RouterModule,
    ReactiveFormsModule,
    InputErrorComponent
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  #el = inject(ElementRef);
  #fb = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);

  codeForm: FormGroup;
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);

  #subscriptions: Subscription[] = [];

  constructor() {
    this.codeForm = this.#fb.group({
      digit1: ['', Validators.required],
      digit2: ['', Validators.required],
      digit3: ['', Validators.required],
      digit4: ['', Validators.required],
      digit5: ['', Validators.required],
      digit6: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscribeToFormChanges();
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  confirm(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.codeForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  private subscribeToFormChanges() {
    Object.keys(this.codeForm.controls).forEach((key, index) => {
      const control = this.codeForm.get(key);

      if (control) {
        const subscription = control.valueChanges.subscribe((value) => {
          if (value.length === 1 && index < Object.keys(this.codeForm.controls).length - 1) {
            const nextControlKey = `digit${index + 2}`;
            const nextControl = this.codeForm.get(nextControlKey);

            if (nextControl) {
              nextControl.markAsTouched();
              const nextInput = this.#el.nativeElement.querySelector(`[formControlName="${nextControlKey}"]`);

              if (nextInput) {
                nextInput.focus();
              }
            }
          }
        });

        this.#subscriptions.push(subscription);
      }
    });
  }

  formHasError(): boolean {
    return this.#validatorsService.formHasError(this.codeForm);
  }

  getFirstError(): string | undefined {
    return this.#validatorsService.getFirstError(this.codeForm);
  }
}
