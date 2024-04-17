import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

import { AuctionImageAssigmentAndReorderService } from '@app/dashboard/services/auction-image-assigment-and-reorder.service';
import { CarPhotoGalleryComponent } from '@app/dashboard/modals/car-photo-gallery/car-photo-gallery.component';
import { ImagesPublish } from '@app/dashboard/interfaces/images-publish';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { AppService } from '@app/app.service';
import { MatIcon } from '@angular/material/icon';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AuctionImageDeletionConfirmationModalComponent } from '@app/dashboard/modals/auction-image-deletion-confirmation-modal/auction-image-deletion-confirmation-modal.component';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CarPhotoGalleryComponent,
    JsonPipe,
    InputErrorComponent,
    ReactiveFormsModule,
    PrimaryButtonDirective,
    CommonModule,
    MatIcon,
    SpinnerComponent,
    AuctionImageDeletionConfirmationModalComponent
  ],
  templateUrl: './auction-image-assignment-and-reorder.component.html',
  styleUrl: './auction-image-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionImageAssignmentAndReorderComponent {
  originalAuctionCarId = signal<string>('');
  auctionImagesForm: FormGroup;

  carPhotoGalleryIsOpen = signal<boolean>(false);
  saveImagesButtonIsDisabled = signal<boolean>(false);
  formFieldName = signal<string>('');
  index = signal<number | undefined>(undefined);
  formArray = signal<FormArray | undefined>(undefined);
  cropImage = signal<boolean>(false);
  deleteImageModalIsOpen = signal<boolean>(false);
  deleteImageSubmitButtonIsDisabled = signal<boolean>(false);

  #activatedRoute = inject(ActivatedRoute);
  #auctionImageAssigmentAndReorderService = inject(AuctionImageAssigmentAndReorderService);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);

  get fotoPrincipal(): FormControl {
    return this.auctionImagesForm.get('fotoPrincipal') as FormControl;
  }

  get fotosSliderPrincipal(): FormArray {
    return this.auctionImagesForm.get('fotosSliderPrincipal') as FormArray;
  }

  get fotosMecanicas(): FormArray {
    return this.auctionImagesForm.get('fotosMecanicas') as FormArray;
  }

  get fotosInterior(): FormArray {
    return this.auctionImagesForm.get('fotosInterior') as FormArray;
  }

  get fotosExterior(): FormArray {
    return this.auctionImagesForm.get('fotosExterior') as FormArray;
  }

  constructor() {
    this.originalAuctionCarId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.getImagesPublish();

    this.auctionImagesForm = this.#formBuilder.group({
      fotoPrincipal: ['', Validators.required],
    });
  }

  saveImages(): void {
    this.saveImagesButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.auctionImagesForm);

    if (!isValid) {
      this.saveImagesButtonIsDisabled.set(false);
      return;
    }

    this.#auctionImageAssigmentAndReorderService.saveImagesPublish$(this.originalAuctionCarId(), this.auctionImagesForm).subscribe({
      next: () => {
        this.toastSuccess('Las imágenes se han guardado correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.saveImagesButtonIsDisabled.set(false);
    });
  }

  openDeleteImageModal(event: Event, formArray: FormArray, index: number): void {
    event.stopPropagation();

    this.index.set(index);
    this.formArray.set(formArray);
    this.deleteImageModalIsOpen.set(true);
  }

  removePhoto(): void {
    this.deleteImageSubmitButtonIsDisabled.set(true);

    this.formArray()!.removeAt(this.index()!);

    this.deleteImageModalIsOpen.set(false);
    this.deleteImageSubmitButtonIsDisabled.set(false);
  }

  addPhoto(formArray: FormArray): void {
    formArray.push(this.#formBuilder.control('', Validators.required));
  }

  closeDeleteImageModal(): void {
    this.deleteImageModalIsOpen.set(false);
  }

  setImage(imageUrl: string) {
    console.log({ imageUrl });
    console.log({ formFieldName: this.formFieldName() });
    console.log({ index: this.index() });

    switch (this.formFieldName()) {
      case 'fotoPrincipal':
        this.auctionImagesForm.setControl('fotoPrincipal', this.#formBuilder.control(imageUrl, Validators.required));
        break;
      case 'fotosSliderPrincipal':
        if (this.index() !== undefined) {
          this.fotosSliderPrincipal.at(this.index()!).patchValue(imageUrl);
        }
        break;
      case 'fotosMecanicas':
        if (this.index() !== undefined) {
          this.fotosMecanicas.at(this.index()!).patchValue(imageUrl);
        }
        break;
      case 'fotosInterior':
        if (this.index() !== undefined) {
          this.fotosInterior.at(this.index()!).patchValue(imageUrl);
        }
        break;
      case 'fotosExterior':
        if (this.index() !== undefined) {
          this.fotosExterior.at(this.index()!).patchValue(imageUrl);
        }
        break;
      default:
        this.auctionImagesForm.patchValue({
          [this.formFieldName()]: imageUrl
        });
        break;
    }
  }

  dropPhotos(event: CdkDragDrop<{ imageUrl: string, index: number }>, formArray: FormArray) {
    const previousIndex = event.previousContainer.data.index;
    const currentIndex = event.container.data.index;

    const previousValue = formArray.at(previousIndex).value;
    const currentValue = formArray.at(currentIndex).value;

    formArray.at(previousIndex).patchValue(currentValue);
    formArray.at(currentIndex).patchValue(previousValue);
  }

  getImagesPublish(): void {
    this.#auctionImageAssigmentAndReorderService.imagesPublish$(this.originalAuctionCarId()).subscribe({
      next: (response: ImagesPublish) => {
        this.auctionImagesForm.setControl('fotoPrincipal', this.#formBuilder.control(response.data.fotoPrincipal, Validators.required));
        this.auctionImagesForm.setControl('fotosSliderPrincipal', this.#formBuilder.array(response.data.fotosSliderPrincipal.map(
          (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        )));
        this.auctionImagesForm.setControl('fotosMecanicas', this.#formBuilder.array(response.data.fotosMecanicas.map(
          (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        ), Validators.minLength(5)));
        this.auctionImagesForm.setControl('fotosInterior', this.#formBuilder.array(response.data.fotosInterior.map(
          (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        ), Validators.minLength(5)));
        this.auctionImagesForm.setControl('fotosExterior', this.#formBuilder.array(response.data.fotosExterior.map(
          (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        ), Validators.minLength(5)));
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  closeModal(varName: WritableSignal<boolean>): void {
    varName.set(false);
  }

  openModal(varName: WritableSignal<boolean>, formFieldName: string, cropImage: boolean, index?: number): void {
    console.log({ index });
    (index !== undefined)
      ? this.index.set(index)
      : this.index.set(undefined);
    console.log({ index: this.index() });

    this.formFieldName.set(formFieldName);
    varName.set(true);
    this.cropImage.set(cropImage);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }

  hasError(field: string, form: FormGroup = this.auctionImagesForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.auctionImagesForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }

  formArrayHasError(formArray: FormArray, index: number): boolean {
    if (!this.auctionImagesForm) return false;

    return this.#validatorsService.formArrayHasError(formArray, index);
  }

  getErrorFromFormArray(formArray: FormArray, index: number): string | undefined {
    if (!this.auctionImagesForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(formArray, index);
  }
}
