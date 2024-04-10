import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppService } from '@app/app.service';
import { AuctionCarService } from '@app/dashboard/services/auction-car.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CarPhotoGalleryComponent } from '@dashboard/modals/car-photo-gallery/car-photo-gallery.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuctionCarDetailsModalComponent } from '@app/dashboard/modals/auction-car-details-modal/auction-car-details-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { CropCarHistoryImageModalComponent } from '@app/dashboard/modals/crop-car-history-image-modal/crop-car-history-image-modal.component';

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
    CropCarHistoryImageModalComponent
  ],
  templateUrl: './add-car-history.component.html',
  styleUrl: './add-car-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCarHistoryComponent {
  originalAuctionCarId = signal<string>('');

  carPhotoGalleryIsOpen = signal<boolean>(false);

  addCarHistoryForm: FormGroup;
  addCarHistorySubmitButtonIsDisabled = signal<boolean>(false);
  auctionCarDetailsModalIsOpen = signal<boolean>(false);
  cropCarHistoryImageModalIsOpen = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #auctionCarService = inject(AuctionCarService);
  #appService = inject(AppService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  get contentFormArray(): FormArray {
    return this.addCarHistoryForm.get('content') as FormArray;
  }

  get contentFormArrayControls(): FormGroup[] {
    return this.contentFormArray.controls as FormGroup[];
  }

  constructor() {
    this.originalAuctionCarId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.addCarHistoryForm = this.#formBuilder.group({
      originalAuctionCarId: [this.originalAuctionCarId(), Validators.required],
      content: this.#formBuilder.array([])
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
      next: (response) => {
        console.log({ response });

        this.addCarHistoryForm.reset();

        this.#router.navigate(['/dashboard/publicar-autos']);

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

  removeContent(index: number): void {
    this.contentFormArray.removeAt(index);
  }

  addContent(type: string): void {
    const nuevoContenido = this.#formBuilder.group({
      type: [type, Validators.required],
      text: ['', Validators.required]
    });

    this.contentFormArray.push(nuevoContenido);
  }

  openCropCarHistoryImageModal(): void {
    this.cropCarHistoryImageModalIsOpen.set(true);
  }

  closeCropCarHistoryImageModal(): void {
    this.cropCarHistoryImageModalIsOpen.set(false);
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

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.addCarHistoryForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.addCarHistoryForm) return undefined;

    return this.#validatorsService.getError(this.addCarHistoryForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}