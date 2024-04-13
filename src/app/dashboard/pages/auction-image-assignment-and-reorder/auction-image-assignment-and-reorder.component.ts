import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuctionImageAssigmentAndReorderService } from '@app/dashboard/services/auction-image-assigment-and-reorder.service';
import { ActivatedRoute } from '@angular/router';
import { ImagesPublish } from '@app/dashboard/interfaces/images-publish';
import { CarPhotoGalleryComponent } from '@app/dashboard/modals/car-photo-gallery/car-photo-gallery.component';
import { JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    CdkDropList,
    CdkDrag,
    CarPhotoGalleryComponent,
    JsonPipe
  ],
  templateUrl: './auction-image-assignment-and-reorder.component.html',
  styleUrl: './auction-image-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionImageAssignmentAndReorderComponent {
  originalAuctionCarId = signal<string>('');
  imagesPublish = signal<ImagesPublish>({} as ImagesPublish);

  carPhotoGalleryIsOpen = signal<boolean>(false);
  selectMechanicImageModalIsOpen = signal<boolean>(false);
  mainPhoto = signal<string>('');
  mainSlider = signal<string[]>([]);

  mainPhotoSlider: string[] = [
    'Foto 1',
    'Foto 2',
    'Foto 3',
    'Foto 4',
  ];

  #auctionImageAssigmentAndReorderService = inject(AuctionImageAssigmentAndReorderService);
  #activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.originalAuctionCarId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.getImagesPublish();
  }

  setMainPhoto(image: string): void {
    this.mainPhoto.set(image);
  }

  setMainSliderImages(image: string): void {
    this.mainSlider.set([...this.mainSlider(), image]);
  }

  closeModal(varName: WritableSignal<boolean>): void {
    varName.set(false);
  }

  openModal(varName: WritableSignal<boolean>): void {
    varName.set(true);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mainPhotoSlider, event.previousIndex, event.currentIndex);
  }

  getImagesPublish(): void {
    this.#auctionImageAssigmentAndReorderService.imagesPublish$(this.originalAuctionCarId()).subscribe({
      next: (response) => {
        console.log(response);

        this.imagesPublish.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
