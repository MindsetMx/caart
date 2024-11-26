import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, Renderer2, effect, inject, signal, untracked, viewChild, viewChildren } from '@angular/core';
import { Carousel, Fancybox } from "@fancyapps/ui";
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { switchMap } from 'rxjs';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';
import { register } from 'swiper/element/bundle';
register();

// import { Thumbs } from '@fancyapps/ui/types/Carousel/plugins/Thumbs/Thumbs';
import { ArtAuctionDetailsService } from '@auctions/services/art-auction-details.service';
import { ArtAuctionImageAssigmentAndReorderService } from '@dashboard/services/art-auction-image-assigment-and-reorder.service';
import { ArtImagesPublish, AuctionCarStatus } from '@dashboard/interfaces';
import { AuctionTypes, AuctionTypesComments } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { CountdownService } from '@shared/services/countdown.service';
import { PrimaryButtonDirective } from '@shared/directives';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { ArtAuctionDetails, GetComments, SpecificArtAuction } from '@auctions/interfaces';
import { AppComponent } from '@app/app.component';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { ArtMetrics } from '@auctions/interfaces/art-metrics';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { AuctionSummaryComponent } from '@auctions/components/auction-summary/auction-summary.component';
import { MomentModule } from 'ngx-moment';
import { MakeAnOfferModalComponent } from '@auctions/modals/make-an-offer-modal/make-an-offer-modal.component';
import { environments } from '@env/environments';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { AuctionCancelledComponent } from '@auctions/modals/auction-cancelled/auction-cancelled.component';
import { TwoColumnAuctionGridComponent } from '@auctions/components/two-column-auction-grid/two-column-auction-grid.component';
import { AuctionDetailsTableComponentComponent } from '@auctions/components/auction-details-table-component/auction-details-table-component.component';
import { ConfirmationModalComponent } from '@shared/modals/confirmation-modal/confirmation-modal.component';
import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { AppService } from '@app/app.service';
import { UpdateReservePriceModalComponent } from '@auctions/modals/update-reserve-price-modal/update-reserve-price-modal.component';
import { UserData } from '@auth/interfaces';
import { NoReserveTagComponentComponent } from '@auctions/components/no-reserve-tag-component/no-reserve-tag-component.component';
import { MatPaginator } from '@angular/material/paginator';
import { BidHistoryComponent } from '@auctions/components/bid-history/bid-history.component';
import { GetBidsBid } from '@auctions/interfaces/get-bids';
import { VideoGalleryService } from '@dashboard/services/video-gallery.service';
import { MediaType } from '@dashboard/enums';
import { VideoGallery as VideosGallery } from '@dashboard/interfaces';

export interface EventData {
  type: string;
  auctions: Auction[];
}

export interface Auction {
  id: string;
  secondsRemaining: number;
  auctionType: string;
}

@Component({
  standalone: true,
  imports: [
    AuctionCancelledComponent,
    AuctionDetailsTableComponentComponent,
    AuctionSummaryComponent,
    CommentComponent,
    CommentsTextareaComponent,
    CommonModule,
    CountdownModule,
    MakeAnOfferModalComponent,
    MomentModule,
    PaymentMethodModalComponent,
    PrimaryButtonDirective,
    StarComponent,
    TwoColumnAuctionGridComponent,
    ConfirmationModalComponent,
    UpdateReservePriceModalComponent,
    NoReserveTagComponentComponent,
    MatPaginator,
    BidHistoryComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction-art.component.html',
  styleUrl: './auction-art.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtComponent implements OnDestroy {
  myCarousel = viewChild<ElementRef>('myCarousel');
  videoGallery = viewChild<ElementRef>('videoGallery');
  rightColumn = viewChild<ElementRef>('rightColumn');
  images = viewChildren<ElementRef>('images');

  readonly #baseUrl = environments.baseUrl;

  auction = signal<ArtAuctionDetails>({} as ArtAuctionDetails);
  auctionCancelledModalIsOpen = signal<boolean>(false);
  auctionDetails = signal<{ label: string, value: string | number }[]>([]);
  auctionId = signal<string | null>(null);
  auctionId2 = signal<string | null>(null);
  comments = signal<GetComments>({} as GetComments);
  eventSource?: EventSource;
  imagesPublish = signal<ArtImagesPublish>({} as ArtImagesPublish);
  isFollowing = signal<boolean | undefined>(undefined);
  makeAnOfferModalIsOpen = signal<boolean>(false);
  metrics = signal<ArtMetrics>({} as ArtMetrics);
  newOfferMade = signal<number>(0);
  offeredAmount = signal<number | undefined>(undefined);
  paymentMethodId = signal<string>('');
  paymentMethodModalIsOpen = signal<boolean>(false);
  specificAuction = signal<SpecificArtAuction>({} as SpecificArtAuction);
  auctionArtId = signal<string>('');
  confirmAcceptPreviewArtModalIsOpen = signal<boolean>(false);
  isAcceptPreviewArtAuctionButtonDisabled = signal<boolean>(false);
  isUpdateReservePriceModalOpen = signal<boolean>(false);
  bids = signal<GetBidsBid[]>([]);

  page = signal<number>(1);
  size = signal<number>(10);

  page2 = signal<number>(0);
  size2 = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);

  mediaTypes = MediaType;
  videos = signal<VideosGallery>({} as VideosGallery);

  secondsRemaining = signal<number>(0);

  #countdownService = inject(CountdownService);
  #artAuctionDetailsService = inject(ArtAuctionDetailsService);
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);
  #artAuctionImageAssigmentAndReorderService = inject(ArtAuctionImageAssigmentAndReorderService);
  #appComponent = inject(AppComponent);
  #paymentMethodsService = inject(PaymentMethodsService);
  #auctionFollowService = inject(AuctionFollowService);
  #commentsService = inject(CommentsService);
  #activityRequestsService = inject(ActivityRequestsService);
  #appService = inject(AppService);
  #renderer = inject(Renderer2);
  #videoGalleryService = inject(VideoGalleryService);

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get auctionTypesComments(): typeof AuctionTypesComments {
    return AuctionTypesComments;
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get auctionCarStatus(): typeof AuctionCarStatus {
    return AuctionCarStatus;
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

  imagesEffect = effect(() => {
    if (this.images().length > 0 && this.imagesPublish().data) {
      const rightColumnHeight = this.rightColumn()?.nativeElement.offsetHeight;

      this.images().forEach((image) => {
        this.#renderer.setStyle(image.nativeElement, 'maxHeight', `${rightColumnHeight}px`);
      });
    }
  });

  authStatusEffect = effect(() => {
    this.getMetrics(this.auctionId());
  });

  auctionEffect = effect(() => {
    if (this.auction().data) {
      untracked(() => {
        this.auctionDetails.set([
          { label: 'Artista', value: this.auction().data.attributes.auctionArtForm.artist },
          { label: 'Año', value: this.auction().data.attributes.auctionArtForm.year },
          { label: 'Materiales', value: this.auction().data.attributes.auctionArtForm.materials },
          { label: 'Rareza', value: (this.auction().data.attributes.auctionArtForm.rarity === 'Edición limitada') ? this.auction().data.attributes.auctionArtForm.rarity + ', ' + this.auction().data.attributes.auctionArtForm.edition : this.auction().data.attributes.auctionArtForm.rarity },
          {
            label: 'Dimensiones',
            value: `${this.auction().data.attributes.auctionArtForm.height} ${this.auction().data.attributes.auctionArtForm.unit} x ${this.auction().data.attributes.auctionArtForm.width} ${this.auction().data.attributes.auctionArtForm.unit}` + (this.auction().data.attributes.auctionArtForm.depth ? ` x ${this.auction().data.attributes.auctionArtForm.depth} ${this.auction().data.attributes.auctionArtForm.unit}` : '')
          },
          { label: 'Condición', value: this.auction().data.attributes.auctionArtForm.condition },
          { label: 'Certificado de autenticidad', value: this.auction().data.attributes.artDetail.certificadoAutenticidad ? 'Sí' + ', ' + this.auction().data.attributes.artDetail.entidadCertificado : 'No' },
          // { label: 'Entidad del certificado', value: this.auction().data.attributes.artDetail.entidadCertificado },
          { label: 'Entrega con marco', value: this.auction().data.attributes.artDetail.entregaConMarco ? 'Sí' : 'No' },
          { label: 'Firma del artista', value: this.auction().data.attributes.artDetail.firmaArtista ? 'Sí' : 'No' },
          { label: 'Procedencia de la obra', value: this.auction().data.attributes.artDetail.procedenciaObra },
          // { label: 'Historia del artista', value: this.auction().data.attributes.artDetail.historiaArtista },
        ]);

        this.getBids();
        this.auctionEffect.destroy();
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

        if (JSON.parse(event.data).type !== 'INITIAL_CONNECTION' && data.type !== 'TIME_UPDATE') {
          this.getAuctionDetails(this.auctionId());
          this.getComments();
          this.page2.set(0);
          this.getBids(true);
        }

        // if (JSON.parse(event.data).type === 'CANCELLED') {
        //   this.auctionCancelledModalIsOpen.set(true);
        // }

        // if (data.type === 'TIME_UPDATE') {

        //   const auction = auctions.find(auction => auction.originalAuctionId === this.auctionId2());

        //   if (auction) {
        //     this.secondsRemaining.set(auction.secondsRemaining);
        //     console.log('secondsRemaining', this.secondsRemaining());
        //   }
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
              });
            }

            break;
        }
      };
    }
  });

  imagesPublishEffect = effect(() => {
    if (this.imagesPublish().data && this.myCarousel()) {
      new Carousel(
        this.myCarousel()?.nativeElement,
        {
          infinite: false,
          Dots: false,
          Thumbs: {
            type: 'classic',
            Carousel: {
              slidesPerPage: 1,
              Navigation: true,
              center: true,
              fill: true,
              dragFree: true,
              Autoplay: {
                autoStart: true,
                timeout: 5000,
              },
            },
          },
        },
        { Thumbs }
      );

      Fancybox.bind('[data-fancybox="gallery"]', {
        Hash: false,
        idle: false,
        compact: false,
        dragToClose: false,

        animated: false,
        showClass: 'f-fadeSlowIn',
        hideClass: false,

        Carousel: {
          infinite: false,
        },

        Images: {
          zoom: false,
          Panzoom: {
            maxScale: 1.5,
          },
        },

        Toolbar: {
          absolute: true,
          display: {
            left: [],
            middle: [],
            right: ['close'],
          },
        },

        Thumbs: {
          type: 'classic',
          Carousel: {
            axis: 'x',

            slidesPerPage: 1,
            Navigation: true,
            center: true,
            fill: true,
            dragFree: true,

            breakpoints: {
              '(min-width: 640px)': {
                axis: 'y',
              },
            },
          },
        },
      });

      Fancybox.bind("[data-fancybox='gallery2']", { Hash: false });
    }
  });

  videoGalleryEffect = effect(() => {
    if (this.videoGallery) {
      this.initSwiperCarousel(this.videoGallery(), this.swiperParams);
    }
  });

  getAllVideosEffect = effect(() => {
    this.getAllVideos();
  });

  constructor() {
    this.#route.paramMap.subscribe(params => {
      let id = params.get('id');

      this.auctionId.set(id);
      this.getAuctionDetails(id);
      this.getImagesPublish(id!);
    });
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  getAllVideos(): void {
    this.#videoGalleryService.getAllVideos$(this.auctionId()!, this.mediaTypes.Art).subscribe((response) => {
      this.videos.set(response.data);
    });
  }

  getBids(replace: boolean = false): void {
    this.page2.update((page) => page + 1);

    this.#artAuctionDetailsService.getPanelBids$(this.auction().data.attributes.originalAuctionArtId, this.page2(), this.size2()).subscribe({
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

  getPhotoFromVideoUrl(videoUrl: string): string {
    const videoId = videoUrl.split('/').slice(-2, -1)[0];

    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`;
  }

  initSwiperCarousel(swiperEl: ElementRef | undefined, swiperParams: any): void {
    if (!swiperEl) return;

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl.nativeElement, swiperParams);

    // and now initialize it
    swiperEl.nativeElement.initialize();
  }

  openUpdateReservePriceModal(): void {
    this.isUpdateReservePriceModalOpen.set(true);
  }

  openConfirmAcceptPreviewArtModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.confirmAcceptPreviewArtModalIsOpen.set(true);
  }

  acceptPreviewArt(): void {
    this.isAcceptPreviewArtAuctionButtonDisabled.set(true);

    this.#activityRequestsService.acceptPreviewArt$(this.auctionArtId()).subscribe({
      next: () => {
        this.getAuctionDetails(this.auctionId());
        this.confirmAcceptPreviewArtModalIsOpen.set(false);
        this.toastSuccess('La obra fue aceptada para vista previa');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isAcceptPreviewArtAuctionButtonDisabled.set(false);
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

  makeAnOfferModalIsOpenChanged(isOpen: boolean): void {
    this.makeAnOfferModalIsOpen.set(isOpen);
  }

  getImagesPublish(originalAuctionArtId: string): void {
    this.#artAuctionImageAssigmentAndReorderService.imagesPublish$(originalAuctionArtId).subscribe({
      next: (response: ArtImagesPublish) => {
        this.imagesPublish.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  getAuctionDetails(auctionId: string | null): void {
    if (!auctionId) return;

    this.#artAuctionDetailsService.getAuctionDetails$(auctionId).pipe(
      switchMap((auctionDetails) => {
        this.auction.set(auctionDetails);
        this.auctionId2.set(auctionDetails.data.id);

        if (this.authStatus === AuthStatus.authenticated) {
          this.getComments();
        }
        return this.#artAuctionDetailsService.getSpecificAuctionDetails$(auctionDetails.data.attributes.originalAuctionArtId);
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

  // getSpecificAuctionDetails(): void {
  //   this.#artAuctionDetailsService.getSpecificAuctionDetails$(this.auction().data.attributes.originalAuctionArtId).subscribe({
  //     next: (specificAuctionDetails) => {
  //       this.specificAuction.set(specificAuctionDetails);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }

  getComments(): void {
    this.#commentsService.getComments$(this.auction().data.attributes.originalAuctionArtId, this.auctionType.art, this.auctionTypesComments.active, this.page(), this.size()).subscribe({
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

  followOrUnfollowAuction(auctionId: string): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    if (this.isFollowing()) {
      this.unfollowAuction(auctionId);
    } else {
      this.followAuction(auctionId);
    }
  }

  followAuction(auctionId: string): void {
    this.#auctionFollowService.followAuction$(auctionId, AuctionTypes.art).subscribe({
      next: (response) => {
        this.getMetrics(auctionId);
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  unfollowAuction(auctionId: string): void {
    this.#auctionFollowService.unfollowAuction$(auctionId, AuctionTypes.art).subscribe({
      next: (response) => {
        this.getMetrics(auctionId);
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getMetrics(auctionId: string | null): void {
    if (!auctionId) return;

    this.#artAuctionDetailsService.getArtMetrics$(auctionId).subscribe({
      next: (metrics) => {
        this.metrics.set(metrics);
        this.isFollowing.set(metrics.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
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

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  transformDate(dateString: string): Date {
    return new Date(dateString);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
