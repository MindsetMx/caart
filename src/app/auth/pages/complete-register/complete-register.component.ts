import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output, WritableSignal, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { idTypes } from '@auth/enums';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'complete-register',
  standalone: true,
  imports: [
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent,
    JsonPipe,
  ],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegisterComponent implements OnInit, OnDestroy {
  // @Input() mb: string = 'mb-32';
  // publicationId = input<string>();
  // auctionType = input<AuctionTypes>();

  // @Output() completeRegisterModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  #appService = inject(AppService);
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #destroyRef: DestroyRef = inject(DestroyRef);
  #activatedRoute = inject(ActivatedRoute);

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  // previewImages: WritableSignal<string[]> = signal(['', '']);
  completeRegisterForm: FormGroup;
  isLoading1 = signal<boolean>(false);
  isLoading2 = signal<boolean>(false);
  validationImg = signal<string[]>([]);

  validationTypeSubscription?: Subscription;

  constructor() {
    this.completeRegisterForm = this.#fb.group({
      taxId: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      streetAndNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      validationType: [idTypes.ine, [Validators.required]],
      validationImg: this.#fb.array([
        ['', [Validators.required]],
        ['', [Validators.required]]
      ]),
    });

    this.subscribeToValidationImgChanges();
  }

  get idTypes(): typeof idTypes {
    return idTypes;
  }

  get validationType(): FormControl {
    return this.completeRegisterForm.get('validationType') as FormControl;
  }

  get validationImgFormArray(): FormArray {
    return this.completeRegisterForm.get('validationImg') as FormArray;
  }

  ngOnInit(): void {
    this.validationTypeSubscription = this.validationType.valueChanges.subscribe((value) => {
      this.setValidationType(value);
    });
  }

  ngOnDestroy(): void {
    if (this.validationTypeSubscription)
      this.validationTypeSubscription.unsubscribe();
  }

  completeRegister(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.completeRegisterForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#authService.completeRegister$(this.completeRegisterForm).subscribe({
      next: () => {
        this.toastSuccess('Registro completado con éxito');

        const returnUrl = this.#activatedRoute.snapshot.queryParams['returnUrl'];

        if (returnUrl) {
          this.#router.navigate([returnUrl]);
          return;
        }

        window.history.back();

        // if (!this.auctionType() || !this.publicationId()) {
        //   window.history.back();
        //   return
        // }

        // switch (this.auctionType()) {
        //   case AuctionTypes.car:
        //     this.#router.navigate(['/completar-registro-vehiculo', this.publicationId()]);
        //     break;
        //   case AuctionTypes.memorabilia:
        //     this.#router.navigate(['/completar-registro-memorabilia', this.publicationId()]);
        //     break;

        //   case AuctionTypes.art:
        //     this.#router.navigate(['/completar-registro-arte', this.publicationId()]);
        //     break;
        // }

        // this.completeRegisterModalIsOpenChange.emit(false);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  setValidationType(type: idTypes): void {
    switch (type) {
      case idTypes.ine:
        this.completeRegisterForm?.setControl('validationImg', new FormArray([
          new FormControl('', Validators.required),
          new FormControl('', Validators.required),
        ]));

        break;
      case idTypes.passport:
        this.completeRegisterForm?.setControl('validationImg', new FormArray([
          new FormControl('', Validators.required),
        ]));

        break;
    }

    this.subscribeToValidationImgChanges();
  }

  private subscribeToValidationImgChanges(): void {
    const validationImgArray = this.completeRegisterForm.get('validationImg') as FormArray;
    validationImgArray.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(value => {
      this.validationImg.set(value);
    });
  }

  // selectFile(event: Event, indice: number): void {
  //   const inputElement = event.target as HTMLInputElement;

  //   if (!inputElement.files?.length) return;

  //   const file = inputElement.files[0];
  //   this.validationImgFormArray.at(indice).setValue(file);

  //   this.showPreview(file, indice);
  // }

  onFileChange(event: Event, indice: number): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);

    if (!file) return;

    switch (indice) {
      case 0:
        this.isLoading1.set(true);
        break;
      case 1:
        this.isLoading2.set(true);
        break;
    }

    this.#cloudinaryCroppedImageService.uploadImageDirect$().pipe(
      switchMap((response) =>
        this.#cloudinaryCroppedImageService.uploadImage$(file, response.result.uploadURL)
      )
    ).subscribe({
      next: (response) => {
        this.validationImgFormArray.at(indice).setValue(response.result.variants[0]);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      switch (indice) {
        case 0:
          this.isLoading1.set(false);
          break;
        case 1:
          this.isLoading2.set(false);
          break;
      }
    });
  }

  // showPreview(archivo: File, indice: number): void {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.previewImages.set(
  //       this.previewImages().map((image, index) => {
  //         if (index === indice) return reader.result as string;
  //         return image;
  //       })
  //     );
  //   }
  //   reader.readAsDataURL(archivo);
  // }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.completeRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.completeRegisterForm) return undefined;

    return this.#validatorsService.getError(this.completeRegisterForm, field);
  }

  formArrayHasError(index: number): boolean {
    if (!this.completeRegisterForm) return false;

    return this.#validatorsService.formArrayHasError(this.validationImgFormArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    if (!this.completeRegisterForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(this.validationImgFormArray, index);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
