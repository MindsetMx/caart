import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuctionImageAssigmentAndReorderService } from '@dashboard/services/auction-image-assigment-and-reorder.service';
import { CarPhotoGalleryComponent } from '@dashboard/modals/car-photo-gallery/car-photo-gallery.component';
import { ImagesPublish } from '@dashboard/interfaces/images-publish';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { AppService } from '@app/app.service';
import { MatIcon } from '@angular/material/icon';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AuctionImageDeletionConfirmationModalComponent } from '@dashboard/modals/auction-image-deletion-confirmation-modal/auction-image-deletion-confirmation-modal.component';
import { AllPhotosDeletionConfirmationModalComponent } from '@dashboard/modals/all-photos-deletion-confirmation-modal/all-photos-deletion-confirmation-modal.component';
import { AuctionPhotoSections } from '@dashboard/enums/auction-photo-sections.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MediaCollection, UploadAction } from '@dashboard/enums';

@Component({
  selector: 'car-auction-image-assignment-and-reorder',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CarPhotoGalleryComponent,
    InputErrorComponent,
    ReactiveFormsModule,
    PrimaryButtonDirective,
    CommonModule,
    MatIcon,
    SpinnerComponent,
    AuctionImageDeletionConfirmationModalComponent,
    AllPhotosDeletionConfirmationModalComponent
  ],
  templateUrl: './auction-image-assignment-and-reorder.component.html',
  styleUrl: './auction-image-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionImageAssignmentAndReorderComponent {
  originalAuctionCarId = signal<string>('');
  auctionImagesForm: FormGroup;
  fotosSliderPrincipal = signal<string[]>([]);
  fotosMecanicas = signal<string[]>([]);
  fotosInterior = signal<string[]>([]);
  fotosExterior = signal<string[]>([]);

  uploadAction = UploadAction;
  selectedUploadAction = signal<UploadAction>(UploadAction.AddExtraPhoto);
  mediaCollection = MediaCollection;

  collection = signal<MediaCollection>(MediaCollection.Register);

  carPhotoGalleryIsOpen = signal<boolean>(false);
  saveImagesButtonIsDisabled = signal<boolean>(false);
  formFieldName = signal<string>('');
  index = signal<number | undefined>(undefined);
  formArray = signal<FormArray | undefined>(undefined);
  cropImage = signal<boolean>(false);
  deleteImageModalIsOpen = signal<boolean>(false);
  deleteImageSubmitButtonIsDisabled = signal<boolean>(false);
  aspectRatios = signal<number[]>([1.477, 1.054, 1, 0]);
  maintainAspectRatio = signal<boolean>(true);
  // aspectRatio = signal<number>(16 / 9);
  allowMultipleSelection = signal<boolean>(false);
  deleteAllImagesModalIsOpen = signal<boolean>(false);
  auctionPhotoSection = signal<AuctionPhotoSections>(AuctionPhotoSections.mechanicalPhotos);
  deleteAllImagesSubmitButtonIsDisabled = signal<boolean>(false);

  #activatedRoute = inject(ActivatedRoute);
  #auctionImageAssigmentAndReorderService = inject(AuctionImageAssigmentAndReorderService);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);

  get fotoPrincipal(): FormControl {
    return this.auctionImagesForm.get('fotoPrincipal') as FormControl;
  }

  get fotoCatalogo(): FormControl {
    return this.auctionImagesForm.get('fotoCatalogo') as FormControl;
  }

  get fotosSliderPrincipalFormArray(): FormArray {
    return this.auctionImagesForm.get('fotosSliderPrincipal') as FormArray;
  }

  get fotosMecanicasFormArray(): FormArray {
    return this.auctionImagesForm.get('fotosMecanicas') as FormArray;
  }

  get fotosInteriorFormArray(): FormArray {
    return this.auctionImagesForm.get('fotosInterior') as FormArray;
  }

  get fotosExteriorFormArray(): FormArray {
    return this.auctionImagesForm.get('fotosExterior') as FormArray;
  }

  get auctionPhotoSectionsTypes(): typeof AuctionPhotoSections {
    return AuctionPhotoSections;
  }

  constructor() {
    this.originalAuctionCarId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.getImagesPublish();

    this.auctionImagesForm = this.#formBuilder.group({
      fotoPrincipal: ['', Validators.required],
      fotoCatalogo: ['', Validators.required],
      fotosSliderPrincipal: this.#formBuilder.array([], [Validators.required, Validators.minLength(5)]),
      fotosMecanicas: this.#formBuilder.array([], [Validators.required, Validators.minLength(1)]),
      fotosInterior: this.#formBuilder.array([], [Validators.required, Validators.minLength(1)]),
      fotosExterior: this.#formBuilder.array([], [Validators.required, Validators.minLength(1)]),
    });

    this.fotosSliderPrincipalFormArray.valueChanges.
      pipe(
        takeUntilDestroyed(),
      ).subscribe((value) => {
        this.fotosSliderPrincipal.set(value);
      });

    this.fotosMecanicasFormArray.valueChanges.
      pipe(
        takeUntilDestroyed(),
      ).subscribe((value) => {
        this.fotosMecanicas.set(value);
      });

    this.fotosInteriorFormArray.valueChanges.
      pipe(
        takeUntilDestroyed(),
      ).subscribe((value) => {
        this.fotosInterior.set(value);
      });

    this.fotosExteriorFormArray.valueChanges.
      pipe(
        takeUntilDestroyed(),
      ).subscribe((value) => {
        this.fotosExterior.set(value);
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

        window.history.back();
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.saveImagesButtonIsDisabled.set(false);
    });
  }

  openDeleteAllImagesModal(auctionPhotoSection: AuctionPhotoSections): void {
    this.auctionPhotoSection.set(auctionPhotoSection);
    this.deleteAllImagesModalIsOpen.set(true);
  }

  closeDeleteAllImagesModal(): void {
    this.deleteAllImagesModalIsOpen.set(false);
  }

  removeAllPhotos(auctionPhotoSection: AuctionPhotoSections): void {
    this.deleteAllImagesSubmitButtonIsDisabled.set(true);

    switch (auctionPhotoSection) {
      case AuctionPhotoSections.mechanicalPhotos:
        this.fotosMecanicasFormArray.clear();
        this.fotosMecanicasFormArray.setValidators(Validators.minLength(1));
        break;
      case AuctionPhotoSections.interiorPhotos:
        this.fotosInteriorFormArray.clear();
        this.fotosInteriorFormArray.setValidators(Validators.minLength(1));
        break;
      case AuctionPhotoSections.exteriorPhotos:
        this.fotosExteriorFormArray.clear();
        this.fotosExteriorFormArray.setValidators(Validators.minLength(1));
        break;
      default:
        break;
    }

    this.deleteAllImagesModalIsOpen.set(false);
    this.deleteAllImagesSubmitButtonIsDisabled.set(false);
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
    switch (this.formFieldName()) {
      case 'fotoCatalogo':
        this.auctionImagesForm.setControl('fotoCatalogo', this.#formBuilder.control(imageUrl, Validators.required));
        break;
      case 'fotoPrincipal':
        this.auctionImagesForm.setControl('fotoPrincipal', this.#formBuilder.control(imageUrl, Validators.required));
        break;
      case 'fotosSliderPrincipal':
        if (this.index() !== undefined) {
          this.fotosSliderPrincipalFormArray.at(this.index()!).patchValue(imageUrl);
        }
        break;
      case 'fotosMecanicas':
        if (this.index() !== undefined) {
          this.fotosMecanicasFormArray.at(this.index()!).patchValue(imageUrl);
        }
        break;
      case 'fotosInterior':
        if (this.index() !== undefined) {
          this.fotosInteriorFormArray.at(this.index()!).patchValue(imageUrl);
        }
        break;
      case 'fotosExterior':
        if (this.index() !== undefined) {
          this.fotosExteriorFormArray.at(this.index()!).patchValue(imageUrl);
        }
        break;
    }
  }

  setImages(images: string[]) {
    switch (this.formFieldName()) {
      case 'fotosMecanicas':
        images.forEach((imageUrl) => this.fotosMecanicasFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));
        break;
      case 'fotosInterior':
        images.forEach((imageUrl) => this.fotosInteriorFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));
        break;
      case 'fotosExterior':
        images.forEach((imageUrl) => this.fotosExteriorFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));
        break;
      default:
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
        this.fotoPrincipal.patchValue(response.data.fotoPrincipal);
        this.fotoCatalogo.patchValue(response.data.fotoCatalogo);

        response.data.fotosSliderPrincipal.forEach((imageUrl: string) => this.fotosSliderPrincipalFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));

        response.data.fotosMecanicas.forEach((imageUrl: string) => this.fotosMecanicasFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));

        response.data.fotosInterior.forEach((imageUrl: string) => this.fotosInteriorFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));

        response.data.fotosExterior.forEach((imageUrl: string) => this.fotosExteriorFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  closeModal(varName: WritableSignal<boolean>): void {
    varName.set(false);
  }

  openModal(varName: WritableSignal<boolean>, formFieldName: string, cropImage: boolean, index?: number, allowMultipleSelection?: boolean): void {
    switch (formFieldName) {
      case 'fotoCatalogo':
        this.collection.set(MediaCollection.Register);
        break;
      case 'fotoPrincipal':
        this.collection.set(MediaCollection.Register);
        break;
      case 'fotosSliderPrincipal':
        this.collection.set(MediaCollection.Register);
        break;
      case 'fotosMecanicas':
        this.collection.set(MediaCollection.Mechanics);
        break;
      case 'fotosInterior':
        this.collection.set(MediaCollection.Interior);
        break;
      case 'fotosExterior':
        this.collection.set(MediaCollection.Exterior);
        break;
    }

    if (cropImage) {
      switch (formFieldName) {
        case 'fotoCatalogo':
          this.aspectRatios.set([1.477, 1.054, 1, 0]);
          this.maintainAspectRatio.set(true);
          break;
        case 'fotoPrincipal':
          this.aspectRatios.set([1.5]);
          this.maintainAspectRatio.set(true);
          break;
        case 'fotosSliderPrincipal':
          this.aspectRatios.set([1.5]);
          break;
      }
    }

    (index !== undefined)
      ? this.index.set(index)
      : this.index.set(undefined);

    (allowMultipleSelection !== undefined)
      ? this.allowMultipleSelection.set(allowMultipleSelection)
      : this.allowMultipleSelection.set(false);

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
    if (!form.controls[field]) return false;

    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.auctionImagesForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }

  formArrayHasError(formArray: FormArray, index: number): boolean {
    if (!formArray.controls[index]) return false;

    return this.#validatorsService.formArrayHasError(formArray, index);
  }

  getErrorFromFormArray(formArray: FormArray, index: number): string | undefined {
    if (!formArray.controls[index]) return undefined;

    return this.#validatorsService.getErrorFromFormArray(formArray, index);
  }
}
