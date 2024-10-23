import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppService } from '@app/app.service';
import { ArtPhotoGalleryService } from '@dashboard/services/art-photo-gallery.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CropImageModalComponent } from '@shared/components/crop-image-modal/crop-image-modal.component';
import { ArtMedia } from '@dashboard/interfaces';
import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';

@Component({
  selector: 'art-photo-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    CropImageModalComponent,
    NgClass,
    UppyAngularDashboardModule,
  ],
  templateUrl: './art-photo-gallery.component.html',
  styleUrl: './art-photo-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtPhotoGalleryComponent {
  registerImageSelectionInputs = viewChildren<ElementRef>('registerImageSelectionInputs');

  uppyDashboardImages = viewChild<ElementRef>('uppyDashboardImages');
  uppyImages?: Uppy;

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
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  artPhotoGallery = signal<ArtMedia>({} as ArtMedia);
  cropArtHistoryImageModalIsOpen = signal<boolean>(false);
  selectedImage: FormControl = this.#formBuilder.control('');
  selectedImages: FormArray = this.#formBuilder.array([]);

  token = signal<string>('');

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

  uploadImageUrlEffect = effect(() => {
    if (this.uppyDashboardImages() && !this.uppyImages && this.token()) {
      this.uppyImages = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 20000000,
          // maxNumberOfFiles: 20,
          minNumberOfFiles: 1,
          allowedFileTypes: ['image/*'],
        },
      }).use(Dashboard,
        {
          height: 300,
          hideUploadButton: true,
          hideCancelButton: true,
          showRemoveButtonAfterComplete: true,
          showProgressDetails: true,
          inline: true,
          hideProgressAfterFinish: true,
          target: this.uppyDashboardImages()?.nativeElement,
          proudlyDisplayPoweredByUppy: false,
          locale: {
            strings: {
              dropPasteFiles: 'Arrastra y suelta tus fotos aquí o %{browse}',
            }
          }
        })
        .use(XHRUpload, {
          endpoint: 'https://batch.imagedelivery.net/images/v1',
          formData: true,
          fieldName: 'file',
          allowedMetaFields: [],
          limit: 1,
          headers: {
            'Authorization': 'Bearer ' + this.token(),
          }
        })
        .on('complete', (result) => {

          result.successful.forEach((file: any) => {
            const url = file.response.body.result.variants[0];

            this.addExtraPhoto([url]);
          });

          this.toastSuccess('Imagenes agregadas');

          // limpiar imagenes de uppy
          this.uppyImages?.getFiles().forEach((file) => {
            this.uppyImages?.removeFile(file.id);
          });
        });
    }
  });

  constructor() {
    this.batchTokenDirect();
  }

  getAllArtMedia(url?: string): void {
    this.#artPhotoGalleryService.getAllArtMedia$(this.auctionArtId()).subscribe({
      next: (response) => {
        this.artPhotoGallery.set(response);

        if (url) {
          if (this.allowMultipleSelection()) {
            this.selectedImages.push(new FormControl(url));
          } else {
            this.selectedImage.setValue(url);
          }
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addExtraPhoto(photoUrls: string[]): void {
    this.#artPhotoGalleryService.addExtraPhoto$(this.auctionArtId(), photoUrls).subscribe({
      next: () => {
        this.getAllArtMedia(photoUrls[0]);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  batchTokenDirect(): void {
    this.#cloudinaryCroppedImageService.batchTokenDirect$().
      subscribe({
        next: (response) => {
          this.token.set(response.result.token);
          console.log({ token: response.result.token });
          console.log({ token: this.token() });
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
