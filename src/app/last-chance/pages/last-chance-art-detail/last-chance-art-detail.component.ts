import { ActivatedRoute } from '@angular/router';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Renderer2, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { forkJoin, switchMap } from 'rxjs';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';

import { AppComponent } from '@app/app.component';
import { ArtAuctionDetailsService } from '@auctions/services/art-auction-details.service';
import { ArtAuctionImageAssigmentAndReorderService } from '@dashboard/services/art-auction-image-assigment-and-reorder.service';
import { ArtImagesPublish, AuctionCarStatus } from '@app/dashboard/interfaces';
import { ArtMetrics } from '@auctions/interfaces/art-metrics';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuctionTypes, AuctionTypesComments } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CommentsService } from '@auctions/services/comments.service';
import { CountdownService } from '@shared/services/countdown.service';
import { environments } from '@env/environments';
import { GetComments, SpecificArtAuctionDetailsLastChance } from '@auctions/interfaces';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { LastChanceArtDetailService } from '@lastChance/services/last-chance-art-detail.service';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { AuctionSummaryComponent } from '@auctions/components/auction-summary/auction-summary.component';
import { MomentModule } from 'ngx-moment';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { AuctionCancelledComponent } from '@auctions/modals/auction-cancelled/auction-cancelled.component';
import { LastChanceAuctionArtDetail, LastChanceBidsBid } from '@app/last-chance/interfaces';
import { TwoColumnAuctionGridComponent } from '@auctions/components/two-column-auction-grid/two-column-auction-grid.component';
import { AuctionDetailsTableComponentComponent } from '@auctions/components/auction-details-table-component/auction-details-table-component.component';
import { LastChanceBidModalComponent } from '@auctions/modals/last-chance-bid-modal/last-chance-bid-modal.component';
import { LastChanceBuyNowModalComponent } from '@auctions/modals/last-chance-buy-now-modal/last-chance-buy-now-modal.component';
import { LastChanceArtPurchaseService } from '@app/last-chance/services/last-chance-art-purchase.service';
import { AppService } from '@app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { BidHistoryComponent } from '@auctions/components/bid-history/bid-history.component';
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
    CountdownModule,
    StarComponent,
    CommentsTextareaComponent,
    PrimaryButtonDirective,
    CommentComponent,
    MomentModule,
    LastChanceBidModalComponent,
    PaymentMethodModalComponent,
    TwoColumnAuctionGridComponent,
    AuctionDetailsTableComponentComponent,
    LastChanceBuyNowModalComponent,
    MatPaginator,
    BidHistoryComponent,
  ],
  templateUrl: './last-chance-art-detail.component.html',
  styleUrl: './last-chance-art-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceArtDetailComponent {
  myCarousel = viewChild<ElementRef>('myCarousel');
  leftColumn = viewChild<ElementRef>('leftColumn');
  rightColumn = viewChild<ElementRef>('rightColumn');

  readonly #baseUrl = environments.baseUrl;

  auction = signal<LastChanceAuctionArtDetail>({} as LastChanceAuctionArtDetail);
  auctionId = signal<string | null>(null);
  auctionId2 = signal<string | null>(null);
  specificAuction = signal<SpecificArtAuctionDetailsLastChance>({} as SpecificArtAuctionDetailsLastChance);
  imagesPublish = signal<ArtImagesPublish>({} as ArtImagesPublish);
  offeredAmount = signal<number | undefined>(undefined);
  paymentMethodId = signal<string>('');
  makeAnOfferModalIsOpen = signal<boolean>(false);
  paymentMethodModalIsOpen = signal<boolean>(false);
  isFollowing = signal<boolean | undefined>(undefined);
  metrics = signal<ArtMetrics>({} as ArtMetrics);
  comments = signal<GetComments>({} as GetComments);
  newOfferMade = signal<number>(0);
  eventSource?: EventSource;
  auctionCancelledModalIsOpen = signal<boolean>(false);
  auctionDetails = signal<{ label: string, value: string | number }[]>([]);
  reserveAmount = signal<number | undefined>(undefined);
  comission = signal<number | undefined>(undefined);
  buyNowModalIsOpen = signal<boolean>(false);
  bids = signal<LastChanceBidsBid[]>([]);

  page = signal<number>(1);
  size = signal<number>(10);

  page2 = signal<number>(0);
  size2 = signal<number>(10)
  pageSizeOptions = signal<number[]>([]);

  mediaTypes = MediaType;
  videos = signal<VideosGallery>({} as VideosGallery);

  #countdownService = inject(CountdownService);
  #artAuctionDetailsService = inject(ArtAuctionDetailsService);
  #lastChanceArtDetailService = inject(LastChanceArtDetailService);
  #authService = inject(AuthService);
  #route = inject(ActivatedRoute);
  #artAuctionImageAssigmentAndReorderService = inject(ArtAuctionImageAssigmentAndReorderService);
  #appComponent = inject(AppComponent);
  #paymentMethodsService = inject(PaymentMethodsService);
  #auctionFollowService = inject(AuctionFollowService);
  #commentsService = inject(CommentsService);
  #lastChanceArtPurchaseService = inject(LastChanceArtPurchaseService);
  #appService = inject(AppService);
  #videoGalleryService = inject(VideoGalleryService);
  #renderer = inject(Renderer2);
  #incrementViewsService = inject(IncrementViewsService);

  auctionCarStatus = AuctionCarStatus;

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get auctionTypesComments(): typeof AuctionTypesComments {
    return AuctionTypesComments;
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

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
          { label: 'Entrega con marco', value: this.auction().data.attributes.artDetail.entregaConMarco ? 'Sí' : 'No' },
          { label: 'Firma del artista', value: this.auction().data.attributes.artDetail.firmaArtista ? 'Sí' : 'No' },
          { label: 'Procedencia de la obra', value: this.auction().data.attributes.artDetail.procedenciaObra },
        ]);

        this.getBids();
      });
    }
  });

  auction2Effect = effect(() => {
    if (this.auctionId2()) {
      this.eventSource?.close();

      this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe-auction/${this.auctionId2()}`);

      this.eventSource.onmessage = (event) => {
        console.log({ event: event });
        this.newOfferMade.set(this.newOfferMade() + 1);

        if (JSON.parse(event.data).type !== 'INITIAL_CONNECTION') {
          // this.getSpecificAuctionDetails();
          this.getAuctionDetails();
          this.getComments();
          this.page2.set(0);
          this.getBids(true);
        }

        if (JSON.parse(event.data).type === 'CANCELLED') {
          this.auctionCancelledModalIsOpen.set(true);
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
    }
  });

  columnsEffect = effect(() => {
    if (this.leftColumn()?.nativeElement && this.rightColumn()?.nativeElement) {
      console.log('columnsEffect');

      const rightColumnHeight = this.rightColumn()?.nativeElement.offsetHeight;
      this.#renderer.setStyle(this.leftColumn()?.nativeElement, 'maxHeight', `${rightColumnHeight}px`);
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

      this.#incrementViewsService.incrementViews$(this.auctionId()!, this.auctionType.art).subscribe();

      this.auctionId.set(id);
      this.getAuctionDetails();
      this.getImagesPublish(id!);
    });
  }

  getAllVideos(): void {
    this.#videoGalleryService.getAllVideos$(this.auctionId()!, this.mediaTypes.Art).subscribe((response) => {
      this.videos.set(response.data);
    });
  }

  getBids(replace: boolean = false): void {
    this.page2.update((page) => page + 1);

    this.#lastChanceArtDetailService.getPanelBids$(this.auction().data.attributes.originalAuctionArtId, this.page2(), this.size2()).subscribe({
      next: (bids) => {
        console.log(bids);

        if (replace) {
          this.bids.set(bids.data.auction.bids);
          this.getBids(false);
          return;
        }

        this.bids.update((bid) => {
          return [...bid, ...bids.data.auction.bids];
        });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openBuyNowModal(): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    forkJoin({
      conditions: this.#lastChanceArtPurchaseService.getConditions(this.auction().data.id),
      paymentMethods: this.#paymentMethodsService.getPaymentMethods$()
    }).subscribe(({ conditions, paymentMethods }) => {
      this.comission.set(conditions.data.commission);
      this.reserveAmount.set(conditions.data.reserveAmount);

      if (paymentMethods.data.length > 0) {
        const paymentMethod = paymentMethods.data.find((paymentMethod) => paymentMethod.attributes.isDefault);

        if (!paymentMethod) {
          throw new Error('No default payment method found');
        }

        this.paymentMethodId.set(paymentMethod.id);
        this.buyNowModalIsOpen.set(true);
        return;
      }

      this.buyNowModalIsOpen.set(true);
    });
  }

  copyUrl(): void {
    navigator.clipboard.writeText(window.location.href);

    this.toastSuccess('URL copiada');
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


  getAuctionDetails(): void {
    this.#lastChanceArtDetailService.getAuctionDetails$(this.auctionId()!).pipe(
      switchMap((auctionDetails) => {
        this.auction.set(auctionDetails);
        this.auctionId2.set(auctionDetails.data.id);

        if (this.authStatus === AuthStatus.authenticated) {
          this.getComments();
        }
        return this.#artAuctionDetailsService.getSpecificAuctionDetailsLastChance$(auctionDetails.data.attributes.carHistory.originalAuctionArtId);
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
  //   this.#artAuctionDetailsService.getSpecificAuctionDetails$(this.auction().data.attributes.carHistory.originalAuctionArtId).subscribe({
  //     next: (specificAuctionDetails) => {
  //       this.specificAuction.set(specificAuctionDetails);
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }

  getComments(): void {
    this.#commentsService.getComments$(this.auction().data.attributes.carHistory.originalAuctionArtId, this.auctionType.art, this.auctionTypesComments.lastChance, this.page(), this.size()).subscribe({
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
    let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime),
      prettyText: (text) => this.#countdownService.prettyText(leftTime, text),
    };
  }

  getSecondsUntilEndDate(endDate: string): number {
    return this.#countdownService.getSecondsUntilEndDate(endDate);
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
