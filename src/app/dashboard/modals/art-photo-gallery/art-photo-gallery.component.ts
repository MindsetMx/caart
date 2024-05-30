import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, signal, viewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '@app/app.service';
import { ArtPhotoGalleryService } from '@dashboard/services/art-photo-gallery.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CropImageModalComponent } from '@shared/components/crop-image-modal/crop-image-modal.component';
import { ArtMedia } from '@dashboard/interfaces';

@Component({
  selector: 'art-photo-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    CropImageModalComponent,
    NgClass
  ],
  templateUrl: './art-photo-gallery.component.html',
  styleUrl: './art-photo-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtPhotoGalleryComponent {
  registerImageSelectionInputs = viewChildren<ElementRef>('registerImageSelectionInputs');

  isOpen = input.required<boolean>();
  auctionArtId = input.required<string>();
  cropImage = input<boolean>(false);
  aspectRatios = input.required<number[]>();
  allowMultipleSelection = input<boolean>(false);
  isOpenChange = output<boolean>();
  selectedImageChange = output<string>();
  selectedImagesChange = output<string[]>();

  #artPhotoGalleryService = inject(ArtPhotoGalleryService);
  #appService = inject(AppService);
  #formBuilder = inject(FormBuilder);

  artPhotoGallery = signal<ArtMedia>({} as ArtMedia);
  cropArtHistoryImageModalIsOpen = signal<boolean>(false);
  selectedImage: FormControl = this.#formBuilder.control('');
  selectedImages: FormArray = this.#formBuilder.array([]);

  auctionArtIdEffect = effect(() => {
    if (this.auctionArtId()) {
      this.getAllArtMedia();
    }
  });

  isOpenChangeEffect = effect(() => {
    if (!this.isOpen()) {
      this.selectedImage.setValue('');
      this.selectedImages.clear();
    }
  });

  getAllArtMedia(): void {
    this.#artPhotoGalleryService.getAllArtMedia$(this.auctionArtId()).subscribe({
      next: (response) => {
        this.artPhotoGallery.set(response);
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

      this.cropArtHistoryImageModalIsOpen.set(true);
    } else {
      if (this.allowMultipleSelection()) {
        this.selectedImagesChange.emit(this.selectedImages?.value);
        //unselect all images
        this.selectedImages.clear();

        this.clearImageSelections();
      } else {
        this.selectedImageChange.emit(this.selectedImage.value);
        this.selectedImage.setValue('');
      }

      this.closeModal();
    }
  }

  clearImageSelections(): void {
    this.registerImageSelectionInputs().forEach((inputElement) => {
      (inputElement.nativeElement as HTMLInputElement).checked = false;
    });
  }

  croppedImageChange(croppedImage: string): void {
    this.selectedImageChange.emit(croppedImage);
  }

  closeCropArtHistoryImageModal(): void {
    this.cropArtHistoryImageModalIsOpen.set(false);
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
