import { ActivatedRoute } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

import { AppService } from '@app/app.service';
import { AuctionVideoDeletionConfirmationModalComponent } from '@dashboard/modals/auction-video-deletion-confirmation-modal/auction-video-deletion-confirmation-modal.component';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { MediaType } from '@dashboard/enums';
import { PrimaryButtonDirective } from '@shared/directives';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { VideoGalleryComponent } from '@dashboard/modals/video-gallery/video-gallery.component';
import { VideoGalleryService } from '@dashboard/services/video-gallery.service';
import { VideoGalleryVideo } from '@dashboard/interfaces';
import { AllVideosDeletionConfirmationModalComponent } from '@dashboard/modals/all-videos-deletion-confirmation-modal/all-videos-deletion-confirmation-modal.component';

@Component({
  selector: 'art-auction-video-assignment-and-reorder',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    MatIcon,
    VideoGalleryComponent,
    JsonPipe,
    SpinnerComponent,
    PrimaryButtonDirective,
    AuctionVideoDeletionConfirmationModalComponent,
    AllVideosDeletionConfirmationModalComponent
  ],
  templateUrl: './art-auction-video-assignment-and-reorder.component.html',
  styleUrl: './art-auction-video-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionVideoAssignmentAndReorderComponent {
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #activatedRoute = inject(ActivatedRoute);
  #videoGalleryService = inject(VideoGalleryService);
  #appService = inject(AppService);

  videosFormArray = this.#formBuilder.nonNullable.array<VideoGalleryVideo[]>([]);
  videos = signal<VideoGalleryVideo[]>([]);

  index = signal<number | undefined>(undefined);
  deleteImageModalIsOpen = signal<boolean>(false);
  isVideoGalleryOpen = signal<boolean>(false);
  auctionId = signal<string>('');
  allowMultipleSelection = signal<boolean>(false);
  isSaveVideosButtonDisabled = signal<boolean>(false);
  deleteImageSubmitButtonIsDisabled = signal<boolean>(false);
  deleteAllVideosSubmitButtonIsDisabled = signal<boolean>(false);
  deleteAllVideosModalIsOpen = signal<boolean>(false);

  mediaTypes = MediaType;

  videosEffect = effect(() => {
    this.videosFormArray.setValue(this.videos(), { emitEvent: false });
  });

  getAllVideosEffect = effect(() => {
    this.getAllVideos();
  });

  constructor() {
    this.auctionId.set(this.#activatedRoute.snapshot.paramMap.get('id')!);

    this.videosFormArray.valueChanges.subscribe((videos) => {
      this.videos.set(videos);
    });
  }

  getAllVideos(): void {
    this.#videoGalleryService.getAllVideos$(this.auctionId(), this.mediaTypes.Art).subscribe((response) => {
      this.setSelectedVideos(response.data.videos);
    });
  }

  saveVideos(event: Event): void {
    event.preventDefault();

    this.isSaveVideosButtonDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.videosFormArray);

    if (!isValid) {
      this.isSaveVideosButtonDisabled.set(false);
      return;
    }

    const videos: string[] = this.videosFormArray.value
      .map((video) => video?.videoUrl)
      .filter((videoUrl): videoUrl is string => videoUrl !== undefined);

    this.#videoGalleryService.saveVideos$(this.auctionId(), videos, this.mediaTypes.Art).subscribe(() => {
      this.toastSuccess('Videos agregados');
    }).add(() => {
      this.isSaveVideosButtonDisabled.set(false);
    });
  }

  drop(event: CdkDragDrop<string[]>, videos: FormArray): void {
    moveItemInArray(videos.value, event.previousIndex, event.currentIndex);
    this.videosFormArray.setValue(videos.value);
  }

  removePhoto(): void {
    this.deleteImageSubmitButtonIsDisabled.set(true);

    this.videosFormArray.removeAt(this.index()!);

    this.deleteImageModalIsOpen.set(false);
    this.deleteImageSubmitButtonIsDisabled.set(false);
  }

  removeAllVideos(): void {
    this.deleteAllVideosSubmitButtonIsDisabled.set(true);

    this.videosFormArray.clear();

    this.deleteAllVideosModalIsOpen.set(false);
    this.deleteAllVideosSubmitButtonIsDisabled.set(false);
  }

  openDeleteVideoModal(event: Event, index: number): void {
    event.stopPropagation();

    this.index.set(index);
    this.deleteImageModalIsOpen.set(true);
  }

  openModal(index?: number, allowMultipleSelection?: boolean): void {
    (index !== undefined)
      ? this.index.set(index)
      : this.index.set(undefined);

    (allowMultipleSelection !== undefined)
      ? this.allowMultipleSelection.set(allowMultipleSelection)
      : this.allowMultipleSelection.set(false);

    this.isVideoGalleryOpen.set(true);
  }

  setVideoUrl(video: VideoGalleryVideo): void {
    if (this.index() !== undefined) {
      this.videosFormArray.at(this.index()!).setValue(video);
    }
  }

  setSelectedVideos(videos: VideoGalleryVideo[]): void {
    videos.forEach((video) => this.videosFormArray.push(this.#formBuilder.nonNullable.control(video)));
  }

  openDeleteAllVideosModal(): void {
    this.deleteAllVideosModalIsOpen.set(true);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
