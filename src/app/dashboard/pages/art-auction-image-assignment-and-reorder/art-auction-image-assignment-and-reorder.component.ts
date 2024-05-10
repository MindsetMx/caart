import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import { AppService } from '@app/app.service';
import { ArtImagesPublish } from '@dashboard/interfaces';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { ArtPhotoGalleryComponent } from '@dashboard/modals/art-photo-gallery/art-photo-gallery.component';
import { ArtAuctionImageAssigmentAndReorderService } from '@dashboard/services/art-auction-image-assigment-and-reorder.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    ArtPhotoGalleryComponent,
    InputErrorComponent,
    ReactiveFormsModule,
    PrimaryButtonDirective,
    CommonModule,
    MatIcon,
    SpinnerComponent
  ],
  templateUrl: './art-auction-image-assignment-and-reorder.component.html',
  styleUrl: './art-auction-image-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionImageAssignmentAndReorderComponent {
  originalAuctionArtId = signal<string>('');
  auctionImagesForm: FormGroup;

  artPhotoGalleryIsOpen = signal<boolean>(false);
  saveImagesButtonIsDisabled = signal<boolean>(false);
  formFieldName = signal<string>('');
  index = signal<number | undefined>(undefined);
  formArray = signal<FormArray | undefined>(undefined);
  cropImage = signal<boolean>(false);
  deleteImageModalIsOpen = signal<boolean>(false);
  deleteImageSubmitButtonIsDisabled = signal<boolean>(false);
  aspectRatio = signal<number>(16 / 9);
  allowMultipleSelection = signal<boolean>(false);
  deleteAllImagesModalIsOpen = signal<boolean>(false);
  // auctionPhotoSection = signal<any>(AuctionPhotoSections.mechanicalPhotos);
  deleteAllImagesSubmitButtonIsDisabled = signal<boolean>(false);

  #activatedRoute = inject(ActivatedRoute);
  #auctionImageAssigmentAndReorderService = inject(ArtAuctionImageAssigmentAndReorderService);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);

  get fotoPrincipal(): FormControl {
    return this.auctionImagesForm.get('fotoPrincipal') as FormControl;
  }

  get fotoCatalogo(): FormControl {
    return this.auctionImagesForm.get('fotoCatalogo') as FormControl;
  }

  get fotosCarrusel(): FormArray {
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
      case 'fotoPrincipal':
        this.auctionImagesForm.setControl('fotoPrincipal', this.#formBuilder.control(imageUrl, Validators.required));
        break;
      case 'fotosCarrusel':
        if (this.index() !== undefined) {
          this.fotosCarrusel.at(this.index()!).patchValue(imageUrl);
        }
        break;
      default:
        this.auctionImagesForm.patchValue({
          [this.formFieldName()]: imageUrl
        });
        break;
    }
  }

  // setImages(images: string[]) {
  //   switch (this.formFieldName()) {
  //     case 'fotosMecanicas':
  //       images.forEach((imageUrl) => this.fotosMecanicas.push(this.#formBuilder.control(imageUrl, Validators.required)));
  //       break;
  //     case 'fotosInterior':
  //       images.forEach((imageUrl) => this.fotosInterior.push(this.#formBuilder.control(imageUrl, Validators.required)));
  //       break;
  //     case 'fotosExterior':
  //       images.forEach((imageUrl) => this.fotosExterior.push(this.#formBuilder.control(imageUrl, Validators.required)));
  //       break;
  //     default:
  //       break;
  //   }
  // }

  dropPhotos(event: CdkDragDrop<{ imageUrl: string, index: number }>, formArray: FormArray) {
    const previousIndex = event.previousContainer.data.index;
    const currentIndex = event.container.data.index;

    const previousValue = formArray.at(previousIndex).value;
    const currentValue = formArray.at(currentIndex).value;

    formArray.at(previousIndex).patchValue(currentValue);
    formArray.at(currentIndex).patchValue(previousValue);
  }

  getImagesPublish(): void {
    this.#auctionImageAssigmentAndReorderService.imagesPublish$(this.originalAuctionArtId()).subscribe({
      next: (response: ArtImagesPublish) => {
        this.auctionImagesForm.setControl('fotoPrincipal', this.#formBuilder.control(response.data.fotoPrincipal, Validators.required));
        this.auctionImagesForm.setControl('fotoCatalogo', this.#formBuilder.control(response.data.fotoCatalogo, Validators.required));
        this.auctionImagesForm.setControl('fotosCarrusel', this.#formBuilder.array(response.data.fotosCarrusel.map(
          (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        )));
        // this.auctionImagesForm.setControl('fotosMecanicas', this.#formBuilder.array(response.data.fotosMecanicas.map(
        //   (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        // ), Validators.minLength(5)));
        // this.auctionImagesForm.setControl('fotosInterior', this.#formBuilder.array(response.data.fotosInterior.map(
        //   (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        // ), Validators.minLength(5)));
        // this.auctionImagesForm.setControl('fotosExterior', this.#formBuilder.array(response.data.fotosExterior.map(
        //   (imageUrl: string) => this.#formBuilder.control(imageUrl, Validators.required)
        // ), Validators.minLength(5)));
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
          this.aspectRatio.set(25 / 16);
          break;
        case 'fotosCarrusel':
          this.aspectRatio.set(1.5 / 1);
          break;
        default:
          this.aspectRatio.set(16 / 9);
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
