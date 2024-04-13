import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { CarPhotoGalleryService } from '../../services/car-photo-gallery.service';
import { GetAllCarMedia } from '@app/dashboard/interfaces';
import { AppService } from '@app/app.service';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CropCarHistoryImageModalComponent } from '../crop-car-history-image-modal/crop-car-history-image-modal.component';

@Component({
  selector: 'car-photo-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    CropCarHistoryImageModalComponent
  ],
  templateUrl: './car-photo-gallery.component.html',
  styleUrl: './car-photo-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarPhotoGalleryComponent {
  isOpen = input.required<boolean>();
  auctionCarId = input.required<string>();
  isOpenChange = output<boolean>();
  cropImage = input<boolean>(false);
  selectedImageChange = output<string>();

  carPhotoGallery = signal<GetAllCarMedia>({} as GetAllCarMedia);
  cropCarHistoryImageModalIsOpen = signal<boolean>(false);
  selectedImage: FormControl = new FormControl();

  #carPhotoGalleryService = inject(CarPhotoGalleryService);
  #appService = inject(AppService);

  auctionCarIdEffect = effect(() => {
    console.log({ auctionCarId: this.auctionCarId() });

    if (this.auctionCarId()) {
      this.getAllCarMedia();
    }
  });

  getAllCarMedia(): void {
    this.#carPhotoGalleryService.getAllCarMedia$(this.auctionCarId()).subscribe({
      next: (response) => {
        this.carPhotoGallery.set(response);
        console.log({ carPhotoGallery: this.carPhotoGallery() });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  selectImage(): void {

    if (this.cropImage()) {
      this.closeModal();

      this.cropCarHistoryImageModalIsOpen.set(true);
    } else {
      this.selectedImageChange.emit(this.selectedImage.value);
      this.closeModal();
    }
  }

  closeCropCarHistoryImageModal(): void {
    this.cropCarHistoryImageModalIsOpen.set(false);
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
