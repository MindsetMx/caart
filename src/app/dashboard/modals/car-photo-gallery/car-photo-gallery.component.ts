import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, output, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { JsonPipe, NgClass } from '@angular/common';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppService } from '@app/app.service';
import { CarPhotoGalleryService } from '@app/dashboard/services/car-photo-gallery.service';
import { CropImageModalComponent } from '@shared/components/crop-image-modal/crop-image-modal.component';
import { GetAllCarMedia } from '@dashboard/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CloudinaryCroppedImageService } from '@dashboard/services/cloudinary-cropped-image.service';
import { MediaCollection, MediaType, UploadAction } from '@dashboard/enums';
import { Observable } from 'rxjs';

@Component({
  selector: 'car-photo-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    CropImageModalComponent,
    NgClass,
    JsonPipe,
    UppyAngularDashboardModule,
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

  uploadAction = input.required<UploadAction>();
  collection = input.required<MediaCollection>();

  uppyDashboardImages = viewChild<ElementRef>('uppyDashboardImages');
  uppyImages?: Uppy;
  mediaCollection = MediaCollection;
  mediaType = MediaType;

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
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  carPhotoGallery = signal<GetAllCarMedia>({} as GetAllCarMedia);
  cropCarHistoryImageModalIsOpen = signal<boolean>(false);
  selectedImage: FormControl = this.#formBuilder.control('');
  selectedImages: FormArray = this.#formBuilder.array([]);

  token = signal<string>('');

  auctionCarIdEffect = effect(() => {
    if (this.auctionCarId()) {
      this.getAllCarMedia().subscribe({
        next: (response) => {
          untracked(() => {
            this.carPhotoGallery.set(response);
          });
        }
      });
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

            // this.addExtraPhoto([url]);

            if (this.allowMultipleSelection()) {
              this.selectedImages.push(new FormControl(url));
            } else {
              this.selectedImage.setValue(url);
            }

            switch (this.uploadAction()) {
              case UploadAction.AddExtraPhoto:
                this.addExtraPhoto([url]);
                break;

              case UploadAction.AddPhotosVideos:
                this.addPhotosVideos(MediaType.Car, this.collection(), [url], []);
                break;
            }
          });

          this.toastSuccess('Imagenes agregadas');

          // limpiar imagenes de uppy
          this.uppyImages?.getFiles().forEach((file) => {
            this.uppyImages?.removeFile(file.id);
          });

          this.getAllCarMedia().subscribe({
            next: (response) => {
              this.carPhotoGallery.set(response);
              this.selectImage();
            }
          });

        });
    }
  });

  constructor() {
    this.batchTokenDirect();
  }

  getAllCarMedia(): Observable<GetAllCarMedia> {
    return this.#carPhotoGalleryService.getAllCarMedia$(this.auctionCarId());
  }

  addExtraPhoto(photoUrls: string[]): void {
    this.#carPhotoGalleryService.addExtraPhoto$(this.auctionCarId(), photoUrls).subscribe();
  }

  addPhotosVideos(type: MediaType, collection: MediaCollection, photoUrls: string[], videoUrls: string[]): void {
    this.#carPhotoGalleryService.addPhotosVideos$(this.auctionCarId(), type, collection, photoUrls, videoUrls).subscribe();
  }

  batchTokenDirect(): void {
    this.#cloudinaryCroppedImageService.batchTokenDirect$().
      subscribe({
        next: (response) => {
          this.token.set(response.result.token);
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
