import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, output, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { Uppy } from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppService } from '@app/app.service';
import { environments } from '@env/environments';
import { MediaCollection, MediaType } from '@dashboard/enums';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { VideoGallery, VideoGalleryVideo } from '@dashboard/interfaces';
import { VideoGalleryService } from '@dashboard/services/video-gallery.service';

@Component({
  selector: 'video-gallery',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoGalleryComponent {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardVideos = viewChild<ElementRef>('uppyDashboardVideos');
  videoSelectionInputs = viewChildren<ElementRef>('videoSelectionInputs');

  isOpen = model.required<boolean>();
  auctionId = input.required<string>();
  mediaType = input.required<MediaType>();
  allowMultipleSelection = input<boolean>(false);
  selectedVideosChange = output<VideoGalleryVideo[]>();
  selectedVideoChange = output<VideoGalleryVideo>();

  #videoGalleryService = inject(VideoGalleryService);
  #formBuilder = inject(FormBuilder);
  #appService = inject(AppService);

  videoGallery = signal<VideoGallery>({} as VideoGallery);

  mediaCollection = MediaCollection;

  selectedVideos: FormArray;
  selectedVideo: FormControl;

  uppyVideos?: Uppy;

  auctionIdEffect = effect(() => {
    if (this.auctionId()) {
      this.getAllCarMedia().subscribe({
        next: (response) => {
          untracked(() => {
            this.videoGallery.set(response);
          });
        }
      });
    }
  });

  isOpenChangeEffect = effect(() => {
    if (!this.isOpen()) {
      this.selectedVideo.setValue('');
      this.selectedVideos.clear();
    }
  });

  uploadVideosEffect = effect(() => {
    if (this.uppyDashboardVideos()) {
      this.uppyVideos = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 500000000,
          // maxNumberOfFiles: 20,
          minNumberOfFiles: 1,
          allowedFileTypes: ['video/*'],
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
          target: this.uppyDashboardVideos()?.nativeElement,
          proudlyDisplayPoweredByUppy: false,
          locale: {
            strings: {
              dropPasteFiles: 'Arrastra y suelta tus videos aquí o %{browse}',
            }
          }
        })
        .use(XHRUpload, {
          endpoint: `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/stream`,
          formData: true,
          fieldName: 'file',
          limit: 1,
          headers: {
            'Authorization': `Bearer ${this.#cloudflareToken}`,
          },
          allowedMetaFields: ['requireSignedURLs'],
        })
        .on('complete', (result) => {
          result.successful?.forEach((file: any) => {
            const url = file.response.body.result.preview;

            if (this.allowMultipleSelection()) {
              this.selectedVideos.push(new FormControl(url));
            } else {
              this.selectedVideo.setValue(url);
            }

            this.addVideosToLibrary([url]);
          });

          this.uppyVideos?.getFiles().forEach((file) => {
            this.uppyVideos?.removeFile(file.id);
          });
        });
    }
  });

  constructor(private formBuilder: FormBuilder) {
    this.selectedVideos = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.selectedVideo = this.formBuilder.control('');
    // this.batchTokenDirect();
  }

  selectVideos(): void {
    if (this.allowMultipleSelection()) {
      const selectedVideos = this.videoGallery().videos.filter((video) => this.selectedVideos.value.includes(video.videoUrl));
      this.selectedVideosChange.emit(selectedVideos);

      this.clearVideoSelections();
    } else {
      this.selectedVideoChange.emit(this.videoGallery().videos.find((video) => video.videoUrl === this.selectedVideo.value) || {} as VideoGalleryVideo);
    }

    this.closeModal();
  }

  clearVideoSelections(): void {
    this.videoSelectionInputs().forEach((inputElement) => {
      (inputElement.nativeElement as HTMLInputElement).checked = false;
    });
  }

  addVideosToLibrary(videoUrls: string[]): void {
    this.#videoGalleryService.addVideosToLibrary$(this.auctionId(), this.mediaType(), this.mediaCollection.Register, [], videoUrls).subscribe(() => {
      this.getAllCarMedia().subscribe({
        next: (response) => {
          this.videoGallery.set(response);
          this.selectVideos();
        }
      });
    });
  }

  getAllCarMedia(): Observable<VideoGallery> {
    return this.#videoGalleryService.getAllCarVideos$(this.auctionId(), this.mediaType());
  }

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.selectedVideos.push(this.#formBuilder.control(target.value));
    } else {
      const index = this.selectedVideos.controls.findIndex(x => x.value === target.value);
      this.selectedVideos.removeAt(index);
    }
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
