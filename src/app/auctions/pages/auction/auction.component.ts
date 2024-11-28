import 'moment/locale/es';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, signal, inject, effect, viewChild, OnDestroy, untracked } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { CountdownConfig } from 'ngx-countdown';
import { Fancybox } from "@fancyapps/ui";
import { MatPaginator } from '@angular/material/paginator';
import { MomentModule } from 'ngx-moment';
import { register } from 'swiper/element/bundle';
import { switchMap } from 'rxjs';
register();

import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { AppComponent } from '@app/app.component';
import { AppService } from '@app/app.service';
import { AuctionCancelledComponent } from '@auctions/modals/auction-cancelled/auction-cancelled.component';
import { AuctionCarStatus } from '@app/dashboard/interfaces';
import { AuctionDetails, AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionDetailsTableComponentComponent } from '@auctions/components/auction-details-table-component/auction-details-table-component.component';
import { AuctionImageAssigmentAndReorderService } from '@dashboard/services/auction-image-assigment-and-reorder.service';
import { AuctionSummaryComponent } from '@auctions/components/auction-summary/auction-summary.component';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { AuctionTypesComments } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { BidHistoryComponent } from '@auctions/components/bid-history/bid-history.component';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { ConfirmationModalComponent } from '@shared/modals/confirmation-modal/confirmation-modal.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CurrentAuctionsComponent } from '@auctions/components/current-auctions/current-auctions.component';
import { environments } from '@env/environments';
import { EventData } from '@app/art/pages/auction-art/auction-art.component';
import { GetComments } from '@auctions/interfaces/get-comments';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';
import { ImagesPublish } from '@dashboard/interfaces/images-publish';
import { MakeAnOfferModalComponent } from '@auctions/modals/make-an-offer-modal/make-an-offer-modal.component';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { StickyAuctionInfoBarComponent } from '@auctions/components/car-auction-details/sticky-auction-info-bar/sticky-auction-info-bar.component';
import { TwoColumnAuctionGridComponent } from '@auctions/components/two-column-auction-grid/two-column-auction-grid.component';
import { UpdateReservePriceModalComponent } from '@auctions/modals/update-reserve-price-modal/update-reserve-price-modal.component';
import { UserData } from '@auth/interfaces';
import { GetBidsBid } from '@auctions/interfaces/get-bids';
import { VideoGalleryService } from '@dashboard/services/video-gallery.service';
import { MediaType } from '@dashboard/enums';
import { VideoGallery as VideosGallery } from '@dashboard/interfaces';
import { IncrementViewsService } from '@auctions/services/increment-views.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MakeAnOfferModalComponent,
    PrimaryButtonDirective,
    StarComponent,
    CurrencyPipe,
    MomentModule,
    ImageGalleryComponent,
    PaymentMethodModalComponent,
    CommentsTextareaComponent,
    CommentComponent,
    AuctionSummaryComponent,
    CurrentAuctionsComponent,
    AuctionCancelledComponent,
    StickyAuctionInfoBarComponent,
    TwoColumnAuctionGridComponent,
    AuctionDetailsTableComponentComponent,
    ConfirmationModalComponent,
    UpdateReservePriceModalComponent,
    MatPaginator,
    BidHistoryComponent,
  ],
  providers: [
    DecimalPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionComponent implements AfterViewInit, OnDestroy {
  readonly #baseUrl = environments.baseUrl;

  videoGallery = viewChild<ElementRef>('videoGallery');

  auction = signal<AuctionDetails>({} as AuctionDetails);
  auctionId = signal<string | null>(null);
  auctionId2 = signal<string | null>(null);
  comments = signal<GetComments>({} as GetComments);
  eventSource?: EventSource;
  isFollowing = signal<boolean>(false);
  makeAnOfferModalIsOpen = signal<boolean>(false);
  metrics = signal<AuctionMetrics>({} as AuctionMetrics);
  paymentMethodId = signal<string>('');
  paymentMethodModalIsOpen = signal<boolean>(false);
  specificAuction = signal<SpecificAuction>({} as SpecificAuction);
  offeredAmount = signal<number | undefined>(undefined);
  newOfferMade = signal<number>(0);
  auctionCancelledModalIsOpen = signal<boolean>(false);
  imagesPublish = signal<ImagesPublish>({} as ImagesPublish);
  auctionDetails = signal<{ label: string, value: string | number }[]>([]);
  auctionDetails2 = signal<{ label: string, value: string | number }[]>([]);
  auctionCarId = signal<string>('');
  confirmAcceptPreviewCarModalIsOpen = signal<boolean>(false);
  isAcceptPreviewCarAuctionButtonDisabled = signal<boolean>(false);
  isUpdateReservePriceModalOpen = signal<boolean>(false);
  secondsRemaining = signal<number>(0);
  bids = signal<GetBidsBid[]>([]);

  page = signal<number>(1);
  size = signal<number>(10);

  page2 = signal<number>(0);
  size2 = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);

  mediaTypes = MediaType;
  videos = signal<VideosGallery>({} as VideosGallery);

  #appComponent = inject(AppComponent);
  #auctionDetailsService = inject(AuctionDetailsService);
  #authService = inject(AuthService);
  #commentsService = inject(CommentsService);
  #countdownService = inject(CountdownService);
  #paymentMethodsService = inject(PaymentMethodsService);
  #route = inject(ActivatedRoute);
  #auctionImageAssigmentAndReorderService = inject(AuctionImageAssigmentAndReorderService);
  #videoGalleryService = inject(VideoGalleryService);
  #activityRequestsService = inject(ActivityRequestsService);
  #appService = inject(AppService);
  #decimalPipe = inject(DecimalPipe);
  #incrementViewsService = inject(IncrementViewsService);

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get auctionTypesComments(): typeof AuctionTypesComments {
    return AuctionTypesComments;
  }

  get auctionCarStatus(): typeof AuctionCarStatus {
    return AuctionCarStatus;
  }

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get swiperParams(): any {
    return {
      injectStyles: [
        `
    .swiper-scrollbar {
      opacity: 1!important;
      height: 6px!important;
      background-color: #d9d9d9!important;
    }
    .swiper-scrollbar-drag {
      background-color: black!important;
      height: 6px!important;
    }
    `
      ],
      spaceBetween: 20,
      loop: true,
      scrollbar: {
        hide: true
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
      },
    }
  };

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  getMetricsEffect = effect(() => {
    this.getMetrics(this.auctionId());
  });

  videoGalleryEffect = effect(() => {
    if (this.videoGallery) {
      this.initSwiperCarousel(this.videoGallery(), this.swiperParams);
    }
  });

  auctionEffect = effect(() => {
    if (this.auction().data) {
      untracked(() => {
        this.auctionDetails.set([
          { label: 'Marca', value: this.auction().data.attributes.auctionCarForm.brand },
          { label: 'Modelo', value: this.auction().data.attributes.auctionCarForm.carModel },
          { label: 'Año', value: this.auction().data.attributes.auctionCarForm.year },
          // { label: 'VIN', value: this.auction().data.attributes.exteriorDetails.VIN },
          { label: 'Motor', value: this.auction().data.attributes.auctionCarForm.engine },
        ]);

        this.auctionDetails2.set([
          {
            label: this.auction().data.attributes.auctionCarForm.kmType.charAt(0).toUpperCase() + this.auction().data.attributes.auctionCarForm.kmType.slice(1).toLowerCase(),
            value: this.#decimalPipe.transform(this.auction().data.attributes.auctionCarForm.kmInput, '1.0-0')!
          },
          { label: 'Transmisión', value: this.auction().data.attributes.auctionCarForm.transmissionType },
          { label: 'Color', value: this.auction().data.attributes.auctionCarForm.exteriorColor },
          { label: 'Entregado en', value: 'CDMX, México' },
        ]);

        console.log('auctionEffect');

        this.page2.set(0);
        this.getBids(true);
      });
    }
  });

  auction2Effect = effect(() => {
    if (this.auctionId2()) {
      this.eventSource?.close();

      this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe-auction/${this.auctionId2()}`);

      this.eventSource.onmessage = (event) => {
        const data: EventData = JSON.parse(event.data);

        // this.newOfferMade.set(this.newOfferMade() + 1);

        if (data.type !== 'INITIAL_CONNECTION' && data.type !== 'TIME_UPDATE') {
          this.getSpecificAuctionDetails();
          this.getAuctionDetails(this.auctionId());
          this.getComments();
          this.page2.set(0);
          this.getBids(true);
        }

        // if (JSON.parse(event.data).type === 'CANCELLED') {
        //   this.auctionCancelledModalIsOpen.set(true);
        // }

        switch (data.type) {
          case 'CANCELLED':
            this.auctionCancelledModalIsOpen.set(true);
            break;

          case 'TIME_UPDATE':
            const auctions = data.auctions;

            if (auctions) {
              untracked(() => {
                this.secondsRemaining.set(auctions[0].secondsRemaining);
                console.log({ secondsRemaining: this.secondsRemaining() });
              });
            }
            break;
        }
      };
    }
  });

  getAllVideosEffect = effect(() => {
    this.getAllVideos();
  });

  constructor() {
    this.#route.paramMap.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      let id = params.get('id');
      this.auctionId.set(id);
      this.#incrementViewsService.incrementViews$(this.auctionId()!, this.auctionType.car).subscribe();
      this.getAuctionDetails(id);
      this.getImagesPublish(id!);
    });
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  ngAfterViewInit(): void {
    Fancybox.bind("[data-fancybox='gallery']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery2']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery3']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery4']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery5']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery6']", { Hash: false });
  }

  getAllVideos(): void {
    this.#videoGalleryService.getAllVideos$(this.auctionId()!, this.mediaTypes.Car).subscribe((response) => {
      this.videos.set(response.data);
    });
  }

  countdownConfig(): CountdownConfig {
    return {
      leftTime: this.secondsRemaining(),
      format: this.getFormat(this.secondsRemaining()),
      prettyText: (text) => this.#countdownService.prettyText(this.secondsRemaining(), text),
    };
  }

  getFormat(seconds: number): string {
    return this.#countdownService.getFormat(seconds);
  }

  openUpdateReservePriceModal(): void {
    this.isUpdateReservePriceModalOpen.set(true);
  }

  openConfirmAcceptPreviewCarModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.confirmAcceptPreviewCarModalIsOpen.set(true);
  }

  getBids(replace: boolean = false): void {
    console.log('getBids');

    this.page2.update((page) => page + 1);

    this.#auctionDetailsService.getPanelBids$(this.auction().data.attributes.originalAuctionCarId, this.page2(), this.size2()).subscribe({
      next: (bids) => {
        console.log(bids);

        if (replace) {
          this.bids.set(bids.data.bids);
          this.getBids(false);
          return;
        }

        this.bids.update((bid) => {
          return [...bid, ...bids.data.bids];
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  acceptPreviewCar(): void {
    this.isAcceptPreviewCarAuctionButtonDisabled.set(true);

    this.#activityRequestsService.acceptPreviewCar$(this.auctionCarId()).subscribe({
      next: () => {
        this.getAuctionDetails(this.auctionId());
        this.confirmAcceptPreviewCarModalIsOpen.set(false);
        this.toastSuccess('El auto fue aceptado para vista previa');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isAcceptPreviewCarAuctionButtonDisabled.set(false);
    });
  }

  getImagesPublish(originalAuctionCarId: string): void {
    this.#auctionImageAssigmentAndReorderService.imagesPublish$(originalAuctionCarId).subscribe({
      next: (response: ImagesPublish) => {
        this.imagesPublish.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  makeAnOfferModalIsOpenChanged(isOpen: boolean): void {
    this.makeAnOfferModalIsOpen.set(isOpen);
  }

  getPhotoFromVideoUrl(videoUrl: string): string {
    const videoId = videoUrl.split('/').slice(-2, -1)[0];

    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`;
  }

  getComments(): void {
    this.#commentsService.getComments$(this.auction().data.attributes.originalAuctionCarId, this.auctionType.car, this.auctionTypesComments.active, this.page(), this.size()).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.pageSizeOptions.set(this.calculatePageSizeOptions(comments.meta.totalCount));
        //invertir el orden de los comentarios
        // this.comments().data = this.comments().data.reverse();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.comments().meta.pageSize; i <= totalItems; i += this.comments().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }

  onPageChange(event: any): void {
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);
    this.getComments();
  }

  getMetrics(auctionId: string | null): void {
    if (!auctionId) return;

    this.#auctionDetailsService.getMetrics$(auctionId).subscribe({
      next: (metrics: AuctionMetrics) => {
        this.metrics.set(metrics);
        this.isFollowing.set(metrics.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getAuctionDetails(auctionId: string | null): void {
    console.log('getAuctionDetails');

    if (!auctionId) return;

    this.#auctionDetailsService.getAuctionDetails$(auctionId).pipe(
      switchMap((auctionDetails) => {
        this.auction.set(auctionDetails);
        this.auctionId2.set(auctionDetails.data.id);

        this.getComments();
        return this.#auctionDetailsService.getSpecificAuctionDetails$(auctionDetails.data.attributes.originalAuctionCarId);
      })
    ).subscribe({
      next: (specificAuctionDetails) => {
        this.specificAuction.set(specificAuctionDetails);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getSpecificAuctionDetails(): void {
    this.#auctionDetailsService.getSpecificAuctionDetails$(this.auction().data.attributes.originalAuctionCarId).subscribe({
      next: (specificAuctionDetails) => {
        this.specificAuction.set(specificAuctionDetails);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  transformDate(dateString: string): Date {
    return new Date(dateString);
  }

  getSecondsUntilEndDate(endDate: string): number {
    return this.#countdownService.getSecondsUntilEndDate(endDate);
  }

  getFormat2(seconds: number): string {
    return this.#countdownService.getFormat2(seconds);
  }

  openMakeAnOfferModal(offeredAmount?: number): void {
    this.offeredAmount.set(undefined);

    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    //Si tiene un método de pago registrado, se abre el modal
    this.#paymentMethodsService.getPaymentMethods$().subscribe((paymentMethods) => {
      if (paymentMethods.data.length > 0) {
        const paymentMethod = paymentMethods.data.find((paymentMethod) => paymentMethod.attributes.isDefault);

        if (!paymentMethod) {
          throw new Error('No default payment method found');
        }

        this.paymentMethodId.set(paymentMethod.id);
        this.offeredAmount.set(offeredAmount);
        this.makeAnOfferModalIsOpen.set(true);
        return;
      }

      //Si no tiene un método de pago registrado, se abre el modal de registro de método de pago
      this.paymentMethodModalIsOpen.set(true);
    });
  }

  refreshPaymentMethods(): void {
    this.#paymentMethodsService.getPaymentMethods$().subscribe((paymentMethods) => {
      const paymentMethod = paymentMethods.data.find((paymentMethod) => paymentMethod.attributes.isDefault);

      if (!paymentMethod) {
        throw new Error('No default payment method found');
      }

      this.paymentMethodId.set(paymentMethod.id);
    });
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  initSwiperCarousel(swiperEl: ElementRef | undefined, swiperParams: any): void {
    if (!swiperEl) return;

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl.nativeElement, swiperParams);

    // and now initialize it
    swiperEl.nativeElement.initialize();
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
