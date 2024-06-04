import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, signal, viewChildren } from '@angular/core';
import { JsonPipe, NgClass } from '@angular/common';

import { AppService } from '@app/app.service';
import { CarPhotoGalleryService } from '@app/dashboard/services/car-photo-gallery.service';
import { CropImageModalComponent } from '@shared/components/crop-image-modal/crop-image-modal.component';
import { GetAllCarMedia } from '@dashboard/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'car-photo-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    CropImageModalComponent,
    NgClass,
    JsonPipe
  ],
  templateUrl: './car-photo-gallery.component.html',
  styleUrl: './car-photo-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarPhotoGalleryComponent {
  registerImageSelectionInputs = viewChildren<ElementRef>('registerImageSelectionInputs');
  mechanicsImageSelectionInputs = viewChildren<ElementRef>('mechanicsImageSelectionInputs');
  interiorImageSelectionInputs = viewChildren<ElementRef>('interiorImageSelectionInputs');
  exteriorImageSelectionInputs = viewChildren<ElementRef>('exteriorImageSelectionInputs');

  isOpen = input.required<boolean>();
  auctionCarId = input.required<string>();
  cropImage = input<boolean>(false);
  aspectRatios = input.required<number[]>();
  allowMultipleSelection = input<boolean>(false);
  isOpenChange = output<boolean>();
  selectedImageChange = output<string>();
  selectedImagesChange = output<string[]>();

  #carPhotoGalleryService = inject(CarPhotoGalleryService);
  #appService = inject(AppService);
  #formBuilder = inject(FormBuilder);

  carPhotoGallery = signal<GetAllCarMedia>({} as GetAllCarMedia);
  cropCarHistoryImageModalIsOpen = signal<boolean>(false);
  selectedImage: FormControl = this.#formBuilder.control('');
  selectedImages: FormArray = this.#formBuilder.array([]);

  auctionCarIdEffect = effect(() => {
    if (this.auctionCarId()) {
      this.getAllCarMedia();
    }
  });

  isOpenChangeEffect = effect(() => {
    if (!this.isOpen()) {
      this.selectedImage.setValue('');
      this.selectedImages.clear();
    }
  });

  getAllCarMedia(): void {
    this.#carPhotoGalleryService.getAllCarMedia$(this.auctionCarId()).subscribe({
      next: (response) => {
        this.carPhotoGallery.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onImageSelect(event: Event, url: string): void {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.selectedImages?.push(new FormControl(url));
    } else {
      let i: number = 0;
      this.selectedImages?.controls.forEach((item: AbstractControl) => {
        if (item.value == url) {
          this.selectedImages?.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  selectImage(): void {
    if (this.cropImage()) {
      this.closeModal();

      this.cropCarHistoryImageModalIsOpen.set(true);
    } else {
      if (this.allowMultipleSelection()) {
        this.selectedImagesChange.emit(this.selectedImages?.value);

        this.clearImageSelections();
      } else {
        this.selectedImageChange.emit(this.selectedImage.value);
      }

      this.closeModal();
    }
  }

  clearImageSelections(): void {
    this.registerImageSelectionInputs().forEach((inputElement) => {
      (inputElement.nativeElement as HTMLInputElement).checked = false;
    });

    this.mechanicsImageSelectionInputs().forEach((inputElement) => {
      (inputElement.nativeElement as HTMLInputElement).checked = false;
    });

    this.interiorImageSelectionInputs().forEach((inputElement) => {
      (inputElement.nativeElement as HTMLInputElement).checked = false;
    });

    this.exteriorImageSelectionInputs().forEach((inputElement) => {
      (inputElement.nativeElement as HTMLInputElement).checked = false;
    });
  }

  croppedImageChange(croppedImage: string): void {
    this.selectedImageChange.emit(croppedImage);
  }

  closeModal(): void {
    this.emitIsOpenChange(false);
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
