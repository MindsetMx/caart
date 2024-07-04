import { ChangeDetectionStrategy, Component, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperModule, ImageTransform, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { switchMap } from 'rxjs';

import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';
import { InputDirective } from '@shared/directives';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';


@Component({
  selector: 'crop-image-modal',
  standalone: true,
  imports: [
    FormsModule,
    ImageCropperModule,
    InputDirective,
    ModalComponent,
    SpinnerComponent,
  ],
  templateUrl: './crop-image-modal.component.html',
  styleUrl: './crop-image-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropImageModalComponent {
  imageUrl = input.required<string>();
  isOpen = model.required<boolean>();
  aspectRatios = model.required<number[]>();
  maintainAspectRatio = model<boolean>(true);
  croppedImageChange = output<string>();
  aspectRatio = signal<number | undefined>(undefined);

  scale = signal<number>(1);
  scaleStep = signal<number>(0.01);
  translateH = signal<number>(0);
  translateV = signal<number>(0);
  transform = signal<ImageTransform>({
    translateUnit: 'px'
  });

  croppedImage?: File;
  croppedImage2 = signal<SafeUrl>('' as SafeUrl);
  cropImageButtonIsDisabled = signal<boolean>(false);

  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #sanitizer = inject(DomSanitizer);

  aspectRatiosEffect = effect(() => {
    this.aspectRatios()[0] === 0
      ? this.maintainAspectRatio.set(false)
      : this.maintainAspectRatio.set(true);

    untracked(() => {
      this.aspectRatio = signal<number>(this.aspectRatios()[0]);
    });
  }, { allowSignalWrites: true });

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage2.set(this.#sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || ''));

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
        this.cropImageButtonIsDisabled.set(false);
      });
  }

  setAspectRatio(aspectRatio: number): void {
    if (aspectRatio === 0) {
      this.maintainAspectRatio.set(false);
      return;
    }
    else
      this.maintainAspectRatio.set(true);

    this.aspectRatio.set(aspectRatio);
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
    // cropper ready
  }
  loadImageFailed(): void {
    // show message
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);

    this.transform.set({
      translateH: 0,
      translateV: 0,
      scale: 1
    });
  }
}
