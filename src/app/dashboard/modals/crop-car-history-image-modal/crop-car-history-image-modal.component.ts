import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { AngularCropperjsModule, ImageCropperResult } from 'angular-cropperjs';
import { CropperComponent } from 'angular-cropperjs';
import { CloudinaryCroppedImageService } from '../../services/cloudinary-cropped-image.service';


@Component({
  selector: 'crop-car-history-image-modal',
  standalone: true,
  imports: [
    ModalComponent,
    AngularCropperjsModule
  ],
  templateUrl: './crop-car-history-image-modal.component.html',
  styleUrl: './crop-car-history-image-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropCarHistoryImageModalComponent {
  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();
  imageUrl = input.required<string>();

  #sanitizer = inject(DomSanitizer);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  resultImage = signal<HTMLCanvasElement>({} as HTMLCanvasElement);
  resultResult = signal<SafeUrl>('' as SafeUrl);

  angularCropper = viewChild.required<CropperComponent>('angularCropper');
  config = [];

  // angularCropperEffect = effect(() => {
  //   this.angularCropper().cropper.zoom(0.1);
  // });

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }

  cropImage(): void {
    this.resultResult.set(this.angularCropper().imageUrl);
    console.log(this.resultResult());
    this.resultImage.set(this.angularCropper().cropper.getCroppedCanvas());
    console.log(this.resultImage());

    // console.log(this.resultImage);
    this.angularCropper().exportCanvas();
  }

  // resultImageFun(event: ImageCropperResult) {
  //   // this.resultResult.set(this.angularCropper().cropper.getCroppedCanvas().toDataURL('image/jpeg'));

  //   this.resultResult.set(this.angularCropper().cropper.getCroppedCanvas().toDataURL('image/jpeg'));

  //   console.log(this.resultResult());

  //   this.#cloudinaryCroppedImageService.uploadImage$(this.resultResult() as string).subscribe({
  //     next: (response) => {
  //       console.log(response);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }

  resultImageFun(event: ImageCropperResult) {
    this.angularCropper().cropper.getCroppedCanvas().toBlob((blob) => {
      const formData = new FormData();
      formData.append('file', blob!, 'image.jpg'); // Asume que quieres subirlo como JPEG.
      formData.append('upload_preset', 'if8y72iv');

      this.#cloudinaryCroppedImageService.uploadImage$(formData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }, 'image/jpeg');
  }

  checkstatus(event: any) {
    if (event.blob === undefined) {
      return;
    }
    let urlCreator = window.URL;
    this.resultResult.set(this.#sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(new Blob(event.blob))));
  }

  closeModal(): void {
    this.emitIsOpenChange(false);
  }
}
