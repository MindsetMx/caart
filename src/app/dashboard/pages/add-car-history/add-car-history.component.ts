import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppService } from '@app/app.service';
import { AuctionCarService } from '@dashboard/services/auction-car.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CarPhotoGalleryComponent } from '@dashboard/modals/car-photo-gallery/car-photo-gallery.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { AuctionCarDetailsModalComponent } from '@dashboard/modals/auction-car-details-modal/auction-car-details-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    SpinnerComponent,
    PrimaryButtonDirective,
    InputErrorComponent,
    CarPhotoGalleryComponent,
    SidebarComponent,
    AuctionCarDetailsModalComponent,
    MatMenuModule,
    InputDirective,
    MatIcon
  ],
  templateUrl: './add-car-history.component.html',
  styleUrl: './add-car-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarHistoryComponent {
  originalAuctionCarId = signal<string>('');

  carPhotoGalleryIsOpen = signal<boolean>(false);
  aspectRatios = signal<number[]>([1.477, 1.054, 1, 0]);
  addCarHistoryForm: FormGroup;
  addCarHistorySubmitButtonIsDisabled = signal<boolean>(false);
  auctionCarDetailsModalIsOpen = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #auctionCarService = inject(AuctionCarService);
  #appService = inject(AppService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  get blocksFormArray(): FormArray {
    return this.addCarHistoryForm.get('blocks') as FormArray;
  }

  get blocksFormArrayControls(): FormGroup[] {
    return this.blocksFormArray.controls as FormGroup[];
  }

  get extraInfoFormArray(): FormArray {
    return this.addCarHistoryForm.get('extraInfo') as FormArray;
  }

  get extraInfoFormArrayControls(): FormControl[] {
    return this.extraInfoFormArray.controls as FormControl[];
  }

  constructor() {
    this.originalAuctionCarId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.addCarHistoryForm = this.#formBuilder.group({
      originalAuctionCarId: [this.originalAuctionCarId(), Validators.required],
      blocks: this.#formBuilder.array([], Validators.required),
      extract: ['', Validators.required],
      extraInfo: this.#formBuilder.array([
        this.#formBuilder.control('', Validators.required)
      ], Validators.required)
    });
  }

  addCarHistory(): void {
    this.addCarHistorySubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.addCarHistoryForm);

    if (!isValid) {
      this.addCarHistorySubmitButtonIsDisabled.set(false);
      return;
    }

    this.#auctionCarService.addCarHistory$(this.addCarHistoryForm).subscribe({
      next: () => {
        this.addCarHistoryForm.reset();

        this.#router.navigate(['/dashboard/publicar']);

        this.toastSuccess('Historia del auto agregada');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.error);
      }
    }).add(() => {
      this.addCarHistorySubmitButtonIsDisabled.set(false);
    });

    // this.#releaseCarForLiveAuctionService.releaseCarForLiveAuction$(this.addCarHistoryForm).subscribe({
  }

  removeExtraInfo(index: number): void {
    this.extraInfoFormArray.removeAt(index);
  }

  addExtraInfo(): void {
    this.extraInfoFormArray.push(this.#formBuilder.control('', Validators.required));
  }

  deleteBlock(index: number): void {
    this.blocksFormArray.removeAt(index);
  }

  setImage(image: string): void {
    this.addContent('image');

    const lastBlockIndex = this.blocksFormArrayControls.length - 1;

    this.blocksFormArrayControls[lastBlockIndex].get('content')?.setValue(image);
  }

  removeContent(index: number): void {
    this.blocksFormArray.removeAt(index);
  }

  addContent(type: string): void {
    const nuevoContenido = this.#formBuilder.group({
      type: [type, Validators.required],
      content: ['', Validators.required]
    });

    this.blocksFormArray.push(nuevoContenido);
  }

  openAuctionCarDetailsModal(): void {
    this.auctionCarDetailsModalIsOpen.set(true);
  }

  closeAuctionCarDetailsModal(): void {
    this.auctionCarDetailsModalIsOpen.set(false);
  }

  closeCarPhotoGallery(): void {
    this.carPhotoGalleryIsOpen.set(false);
  }

  openCarPhotoGallery(): void {
    this.carPhotoGalleryIsOpen.set(true);
  }

  controlHasError(control: FormControl): boolean {
    return this.#validatorsService.controlHasError(control);
  }

  getErrorFromControl(control: FormControl): string | undefined {
    return this.#validatorsService.getErrorFromControl(control);
  }

  hasError(field: string, form: FormGroup = this.addCarHistoryForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.addCarHistoryForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }

  formArrayHasError(formArray: FormArray, index: number): boolean {
    if (!this.addCarHistoryForm) return false;

    return this.#validatorsService.formArrayHasError(formArray, index);
  }

  getErrorFromFormArray(formArray: FormArray, index: number): string | undefined {
    if (!this.addCarHistoryForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(formArray, index);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
