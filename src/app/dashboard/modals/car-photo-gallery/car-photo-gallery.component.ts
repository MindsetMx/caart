import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { CarPhotoGalleryService } from '../../services/car-photo-gallery.service';
import { GetAllCarMedia } from '@app/dashboard/interfaces';
import { MatIcon } from '@angular/material/icon';
import { AppService } from '@app/app.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'car-photo-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    MatIcon,
    JsonPipe
  ],
  templateUrl: './car-photo-gallery.component.html',
  styleUrl: './car-photo-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarPhotoGalleryComponent {
  isOpen = input.required<boolean>();
  auctionCarId = input.required<string>();
  isOpenChange = output<boolean>();

  carPhotoGallery = signal<GetAllCarMedia>({} as GetAllCarMedia);

  #carPhotoGalleryService = inject(CarPhotoGalleryService);
  #appService = inject(AppService);

  auctionCarIdEffect = effect(() => {
    if (this.auctionCarId()) {
      this.getAllCarMedia();
    }
  });

  copyImageUrl(imageUrl: string): void {
    navigator.clipboard.writeText(imageUrl);

    this.toastSuccess('URL copiada al portapapeles');
  }

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

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
