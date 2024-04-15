import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CloudinaryCroppedImageService } from '../../services/cloudinary-cropped-image.service';
import { ImageCroppedEvent, ImageCropperModule, LoadedImage } from 'ngx-image-cropper';


@Component({
  selector: 'crop-car-history-image-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ImageCropperModule
  ],
  templateUrl: './crop-car-history-image-modal.component.html',
  styleUrl: './crop-car-history-image-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropCarHistoryImageModalComponent {
  isOpen = input.required<boolean>();
  imageUrl = input.required<string>();
  isOpenChange = output<boolean>();
  croppedImageChange = output<string>();

  croppedImage?: Blob | null;
  cropImageButtonIsDisabled = signal<boolean>(false);

  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  resultImage = signal<HTMLCanvasElement>({} as HTMLCanvasElement);

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
    // event.blob can be used to upload the cropped image
  }

  cropImage(): void {
    this.cropImageButtonIsDisabled.set(true);

    if (!this.croppedImage) return;

    this.#cloudinaryCroppedImageService.uploadImage$(this.croppedImage).subscribe((response) => {
      this.emitIsOpenChange(false);
      this.croppedImageChange.emit(response.result.variants[0]);
      this.cropImageButtonIsDisabled.set(false);
    });
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }

  closeModal(): void {
    this.emitIsOpenChange(false);
  }
}
