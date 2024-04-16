import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CloudinaryCroppedImageService } from '../../services/cloudinary-cropped-image.service';
import { ImageCroppedEvent, ImageCropperModule, ImageTransform, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '@shared/directives';
import { switchMap } from 'rxjs';


@Component({
  selector: 'crop-car-history-image-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ImageCropperModule,
    SpinnerComponent,
    FormsModule,
    InputDirective
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

  scale = 1;
  scaleStep = .01;
  transform: ImageTransform = {
    translateUnit: 'px'
  };

  croppedImage?: File;
  cropImageButtonIsDisabled = signal<boolean>(false);

  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  resultImage = signal<HTMLCanvasElement>({} as HTMLCanvasElement);

  imageCropped(event: ImageCroppedEvent) {
    console.log({ event });

    let croppedImageBlob = event.blob;

    if (!croppedImageBlob) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      let base64data = reader.result;
      console.log(base64data);

      this.croppedImage = new File([base64ToFile(base64data as string)], 'cropped-image.png', { type: 'image/png' });

      console.log({ croppedImage: this.croppedImage });

      return this.croppedImage;
    }
    reader.readAsDataURL(croppedImageBlob);
  }

  cropImage(): void {
    this.cropImageButtonIsDisabled.set(true);

    if (!this.croppedImage) return;

    // this.#cloudinaryCroppedImageService.uploadImage$(this.croppedImage).subscribe((response) => {
    //   this.emitIsOpenChange(false);
    //   this.croppedImageChange.emit(response.result.variants[0]);
    //   this.cropImageButtonIsDisabled.set(false);
    // });

    this.#cloudinaryCroppedImageService.uploadImageDirect$()
      .pipe(
        switchMap((response) =>
          this.#cloudinaryCroppedImageService.uploadImage$(this.croppedImage!, response.result.uploadURL)
        )
      ).subscribe((response) => {
        console.log({ response });

        this.emitIsOpenChange(false);
        this.croppedImageChange.emit(response.result.variants[0]);
        this.cropImageButtonIsDisabled.set(false);
      });
  }

  zoomOut() {
    this.scale -= this.scaleStep;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += this.scaleStep;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
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
