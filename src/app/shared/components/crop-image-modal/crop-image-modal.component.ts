import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CloudinaryCroppedImageService } from '../../../dashboard/services/cloudinary-cropped-image.service';
import { ImageCroppedEvent, ImageCropperModule, ImageTransform, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '@shared/directives';
import { switchMap } from 'rxjs';


@Component({
  selector: 'crop-image-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ImageCropperModule,
    SpinnerComponent,
    FormsModule,
    InputDirective
  ],
  templateUrl: './crop-image-modal.component.html',
  styleUrl: './crop-image-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropImageModalComponent {
  isOpen = input.required<boolean>();
  imageUrl = input.required<string>();
  aspectRatio = input<number>(16 / 9);
  isOpenChange = output<boolean>();
  croppedImageChange = output<string>();

  scale = signal<number>(1);
  scaleStep = signal<number>(0.01);
  translateH = signal<number>(0);
  translateV = signal<number>(0);
  transform = signal<ImageTransform>({
    translateUnit: 'px'
  });

  croppedImage?: File;
  croppedImage2?: SafeUrl;
  cropImageButtonIsDisabled = signal<boolean>(false);

  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #sanitizer = inject(DomSanitizer);

  resultImage = signal<HTMLCanvasElement>({} as HTMLCanvasElement);

  imageCropped(event: ImageCroppedEvent): void {
    console.log({ event });

    this.croppedImage2 = this.#sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    console.log({ croppedImage2: this.croppedImage2 });

    let croppedImageBlob = event.blob;

    if (!croppedImageBlob) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      let base64data = reader.result;

      this.croppedImage = new File([base64ToFile(base64data as string)], 'cropped-image.png', { type: 'image/png' });

      return this.croppedImage;
    }

    reader.readAsDataURL(croppedImageBlob);
  }

  cropImage(): void {
    this.cropImageButtonIsDisabled.set(true);

    if (!this.croppedImage) return;

    this.#cloudinaryCroppedImageService.uploadImageDirect$()
      .pipe(
        switchMap((response) =>
          this.#cloudinaryCroppedImageService.uploadImage$(this.croppedImage!, response.result.uploadURL)
        )
      ).subscribe((response) => {
        this.emitIsOpenChange(false);
        this.croppedImageChange.emit(response.result.variants[0]);
        this.transform.set({
          translateH: 0,
          translateV: 0,
          scale: 1
        });
        this.cropImageButtonIsDisabled.set(false);
      });
  }

  moveLeft(): void {
    this.translateH.update((translateH) => translateH + 1);

    this.transform.set({
      ...this.transform(),
      translateH: this.translateH()
    });
  }
  moveRight(): void {
    this.translateH.update((translateH) => translateH - 1);

    this.transform.set({
      ...this.transform(),
      translateH: this.translateH()
    });
  }

  moveTop(): void {
    this.translateV.update((translateV) => translateV + 1);

    this.transform.set({
      ...this.transform(),
      translateV: this.translateV()
    });
  }

  moveBottom(): void {
    this.translateV.update((translateV) => translateV - 1);

    this.transform.set({
      ...this.transform(),
      translateV: this.translateV()
    });
  }

  zoomOut(): void {
    this.scale.set(this.scale() - this.scaleStep());
    this.transform.set({
      ...this.transform(),
      scale: this.scale()
    });
  }

  zoomIn(): void {
    this.scale.set(this.scale() + this.scaleStep());
    this.transform.set({
      ...this.transform(),
      scale: this.scale()
    });
  }

  imageLoaded(image: LoadedImage): void {
    // show cropper
  }
  cropperReady(): void {
    console.log('cropperReady');

    // cropper ready
  }
  loadImageFailed(): void {
    // show message
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);

    this.transform.set({
      translateH: 0,
      translateV: 0,
      scale: 1
    });
  }
}
