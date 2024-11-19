import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, WritableSignal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import { AppService } from '@app/app.service';
import { AuctionImageDeletionConfirmationModalComponent } from '@app/dashboard/modals/auction-image-deletion-confirmation-modal/auction-image-deletion-confirmation-modal.component';
import { ArtImagesPublish } from '@dashboard/interfaces';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { ArtPhotoGalleryComponent } from '@dashboard/modals/art-photo-gallery/art-photo-gallery.component';
import { ArtAuctionImageAssigmentAndReorderService } from '@dashboard/services/art-auction-image-assigment-and-reorder.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'art-auction-image-assignment-and-reorder',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    ArtPhotoGalleryComponent,
    InputErrorComponent,
    ReactiveFormsModule,
    PrimaryButtonDirective,
    CommonModule,
    MatIcon,
    SpinnerComponent,
    AuctionImageDeletionConfirmationModalComponent,
  ],
  templateUrl: './art-auction-image-assignment-and-reorder.component.html',
  styleUrl: './art-auction-image-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionImageAssignmentAndReorderComponent {
  originalAuctionArtId = signal<string>('');
  auctionImagesForm: FormGroup;
  fotosCarrusel = signal<string[]>([]);
  aspectRatios = signal<number[]>([1.477, 1.054, 1, 0]);
  maintainAspectRatio = signal<boolean>(true);

  artPhotoGalleryIsOpen = signal<boolean>(false);
  saveImagesButtonIsDisabled = signal<boolean>(false);
  formFieldName = signal<string>('');
  index = signal<number | undefined>(undefined);
  formArray = signal<FormArray | undefined>(undefined);
  cropImage = signal<boolean>(false);
  deleteImageModalIsOpen = signal<boolean>(false);
  deleteImageSubmitButtonIsDisabled = signal<boolean>(false);
  // aspectRatio = signal<number>(16 / 9);
  allowMultipleSelection = signal<boolean>(false);
  deleteAllImagesModalIsOpen = signal<boolean>(false);
  // auctionPhotoSection = signal<any>(AuctionPhotoSections.mechanicalPhotos);
  deleteAllImagesSubmitButtonIsDisabled = signal<boolean>(false);

  #activatedRoute = inject(ActivatedRoute);
  #auctionImageAssigmentAndReorderService = inject(ArtAuctionImageAssigmentAndReorderService);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);
  #changeDetectorRef = inject(ChangeDetectorRef);

  get fotoPrincipal(): FormControl {
    return this.auctionImagesForm.get('fotoPrincipal') as FormControl;
  }

  get fotoCatalogo(): FormControl {
    return this.auctionImagesForm.get('fotoCatalogo') as FormControl;
  }

  get fotosCarruselFormArray(): FormArray {
    return this.auctionImagesForm.get('fotosCarrusel') as FormArray;
  }

  // get auctionPhotoSectionsTypes(): typeof AuctionPhotoSections {
  //   return AuctionPhotoSections;
  // }

  constructor() {
    this.originalAuctionArtId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.getImagesPublish();

    this.auctionImagesForm = this.#formBuilder.group({
      fotoPrincipal: ['', Validators.required],
      fotoCatalogo: ['', Validators.required],
      fotosCarrusel: this.#formBuilder.array([]),
    });

    this.fotosCarruselFormArray.valueChanges
      .pipe(
        takeUntilDestroyed(),
      ).subscribe((value) => {
        this.fotosCarrusel.set(value);
      });
  }

  saveImages(): void {
    this.saveImagesButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.auctionImagesForm);

    if (!isValid) {
      this.saveImagesButtonIsDisabled.set(false);
      return;
    }

    this.#auctionImageAssigmentAndReorderService.saveImagesPublish$(this.originalAuctionArtId(), this.auctionImagesForm).subscribe({
      next: () => {
        this.toastSuccess('Las imágenes se han guardado correctamente');

        // redireccionar a página anterior
        window.history.back();
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.saveImagesButtonIsDisabled.set(false);
    });
  }

  // openDeleteAllImagesModal(auctionPhotoSection: AuctionPhotoSections): void {
  //   this.auctionPhotoSection.set(auctionPhotoSection);
  //   this.deleteAllImagesModalIsOpen.set(true);
  // }

  closeDeleteAllImagesModal(): void {
    this.deleteAllImagesModalIsOpen.set(false);
  }

  // removeAllPhotos(auctionPhotoSection: AuctionPhotoSections): void {
  //   this.deleteAllImagesSubmitButtonIsDisabled.set(true);

  //   switch (auctionPhotoSection) {
  //     case AuctionPhotoSections.mechanicalPhotos:
  //       this.fotosMecanicas.clear();
  //       break;
  //     case AuctionPhotoSections.interiorPhotos:
  //       this.fotosInterior.clear();
  //       break;
  //     case AuctionPhotoSections.exteriorPhotos:
  //       this.fotosExterior.clear();
  //       break;
  //     default:
  //       break;
  //   }

  //   this.deleteAllImagesModalIsOpen.set(false);
  //   this.deleteAllImagesSubmitButtonIsDisabled.set(false);
  // }

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
      // case 'fotosCarrusel':
      //   console.log(this.index());
      //   console.log(imageUrl);

      //   if (this.index() !== undefined) {
      //     this.fotosCarruselFormArray.at(this.index()!).patchValue(imageUrl);
      //   }
      //   break;
    }
  }

  setImages(images: string[]) {
    switch (this.formFieldName()) {
      case 'fotosCarrusel':
        images.forEach((imageUrl) => this.fotosCarruselFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));
        break;
      default:
        break;
    }
  }

  dropPhotos(event: CdkDragDrop<{ imageUrl: string, index: number }>, formArray: FormArray) {
    // const previousIndex = event.previousContainer.data.index;
    // const currentIndex = event.container.data.index;

    // const previousValue = formArray.at(previousIndex).value;
    // const currentValue = formArray.at(currentIndex).value;

    // formArray.at(previousIndex).patchValue(currentValue);
    // formArray.at(currentIndex).patchValue(previousValue);

    moveItemInArray(formArray.value, event.previousIndex, event.currentIndex);
    formArray.setValue(formArray.value);
  }

  getImagesPublish(): void {
    this.#auctionImageAssigmentAndReorderService.imagesPublish$(this.originalAuctionArtId()).subscribe({
      next: (response: ArtImagesPublish) => {
        this.auctionImagesForm.setControl('fotoPrincipal', this.#formBuilder.control(response.data.fotoPrincipal, Validators.required));
        this.auctionImagesForm.setControl('fotoCatalogo', this.#formBuilder.control(response.data.fotoCatalogo, Validators.required));
        // this.auctionImagesForm.setControl('fotosCarrusel', this.#formBuilder.array(response.data.fotosCarrusel.map(
        //   (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        // )));
        response.data.fotosCarrusel.forEach((imageUrl: string) => this.fotosCarruselFormArray.push(this.#formBuilder.control(imageUrl, Validators.required)));

        this.#changeDetectorRef.detectChanges();
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
    if (cropImage) {
      switch (formFieldName) {
        case 'fotoCatalogo':
          this.aspectRatios.set([1.477, 1.054, 1, 0]);
          this.maintainAspectRatio.set(true);
          break;
        case 'fotoPrincipal':
          this.aspectRatios.set([0]);
          this.maintainAspectRatio.set(false);
          break;
        case 'fotosCarrusel':
          this.aspectRatios.set([0]);
          this.maintainAspectRatio.set(false);
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
