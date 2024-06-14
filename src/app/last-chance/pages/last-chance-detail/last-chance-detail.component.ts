import 'moment/locale/es';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, signal, inject, effect, viewChild, OnDestroy, WritableSignal, untracked } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, SlicePipe } from '@angular/common';
import { Fancybox } from "@fancyapps/ui";
import { forkJoin, switchMap } from 'rxjs';
import { MomentModule } from 'ngx-moment';
import { register } from 'swiper/element/bundle';
register();

import { AppComponent } from '@app/app.component';
import { AuctionCancelledComponent } from '@auctions/modals/auction-cancelled/auction-cancelled.component';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionDetailsTableComponentComponent } from '@auctions/components/auction-details-table-component/auction-details-table-component.component';
import { AuctionImageAssigmentAndReorderService } from '@dashboard/services/auction-image-assigment-and-reorder.service';
import { AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { AuctionSummaryComponent } from '@auctions/components/auction-summary/auction-summary.component';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { AuctionTypesComments } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CurrentAuctionsComponent } from '@auctions/components/current-auctions/current-auctions.component';
import { environments } from '@env/environments';
import { GetComments } from '@auctions/interfaces/get-comments';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';
import { ImagesPublish } from '@dashboard/interfaces/images-publish';
import { InputDirective } from '@shared/directives/input.directive';
import { LastChanceAuctionVehicleDetail } from '@app/last-chance/interfaces';
import { LastChanceBidModalComponent } from '@auctions/modals/last-chance-bid-modal/last-chance-bid-modal.component';
import { LastChanceBuyNowModalComponent } from '@auctions/modals/last-chance-buy-now-modal/last-chance-buy-now-modal.component';
import { LastChancePurchaseService } from '@auctions/services/last-chance-purchase.service';
import { LastChanceStickyInfoBarComponent } from '@app/last-chance/components/last-chance-sticky-info-bar/last-chance-sticky-info-bar.component';
import { LastChanceVehicleDetailService } from '@app/last-chance/services/last-chance-vehicle-detail.service';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { RecentlyCompletedAuctionsComponent } from '@auctions/components/recently-completed-auctions/recently-completed-auctions.component';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { TwoColumnAuctionGridComponent } from '@auctions/components/two-column-auction-grid/two-column-auction-grid.component';
@Component({
  selector: 'last-chance-detail',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    LastChanceBidModalComponent,
    PrimaryButtonDirective,
    StarComponent,
    SlicePipe,
    CurrencyPipe,
    MomentModule,
    ImageGalleryComponent,
    PaymentMethodModalComponent,
    CommentsTextareaComponent,
    CommentComponent,
    RecentlyCompletedAuctionsComponent,
    AuctionSummaryComponent,
    CurrentAuctionsComponent,
    AuctionCancelledComponent,
    LastChanceStickyInfoBarComponent,
    TwoColumnAuctionGridComponent,
    AuctionDetailsTableComponentComponent,
    LastChanceBuyNowModalComponent
  ],
  providers: [
    DecimalPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './last-chance-detail.component.html',
  styleUrl: './last-chance-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceDetailComponent implements AfterViewInit {
  readonly #baseUrl = environments.baseUrl;

  videoGallery = viewChild<ElementRef>('videoGallery');

  auction = signal<LastChanceAuctionVehicleDetail>({} as LastChanceAuctionVehicleDetail);
  auctionId = signal<string | null>(null);
  auctionId2 = signal<string | null>(null);
  comments = signal<GetComments>({} as GetComments);
  eventSource?: EventSource;
  isFollowing = signal<boolean>(false);
  makeAnOfferModalIsOpen = signal<boolean>(false);
  buyNowModalIsOpen = signal<boolean>(false);
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
  comission = signal<number | undefined>(undefined);
  reserveAmount = signal<number | undefined>(undefined);

  #appComponent = inject(AppComponent);
  #auctionDetailsService = inject(AuctionDetailsService);
  #lastChanceVehicleDetailService = inject(LastChanceVehicleDetailService);
  #authService = inject(AuthService);
  #commentsService = inject(CommentsService);
  #countdownService = inject(CountdownService);
  #paymentMethodsService = inject(PaymentMethodsService);
  #route = inject(ActivatedRoute);
  #auctionImageAssigmentAndReorderService = inject(AuctionImageAssigmentAndReorderService);
  #lastChancePurchaseService = inject(LastChancePurchaseService);
  #decimalPipe = inject(DecimalPipe);

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get auctionTypesComments(): typeof AuctionTypesComments {
    return AuctionTypesComments;
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

  authStatusEffect = effect(() => {
    switch (this.authStatus) {
      case AuthStatus.authenticated:
        this.getMetrics(this.auctionId());

        break;
    }
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
          { label: 'VIN', value: this.auction().data.attributes.exteriorDetails.VIN },
        ]);

        this.auctionDetails2.set([
          // { label: 'Km', value: this.auction().data.attributes.auctionCarForm.kmInput },
          { label: 'Km', value: this.#decimalPipe.transform(this.auction().data.attributes.auctionCarForm.kmInput, '1.0-0')! },
          { label: 'Transmisión', value: this.auction().data.attributes.auctionCarForm.transmissionType },
          { label: 'Color', value: this.auction().data.attributes.auctionCarForm.exteriorColor },
          { label: 'Entregado en', value: 'CDMX, México' },
        ]);
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
          this.getSpecificAuctionDetails();
          this.getAuctionDetails(this.auctionId());
          this.getComments();
        }

        if (JSON.parse(event.data).type === 'CANCELLED') {
          this.auctionCancelledModalIsOpen.set(true);
        }
      };
    }
  });

  constructor() {
    this.auctionId.set(this.#route.snapshot.paramMap.get('id'));

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

  ngAfterViewInit(): void {
    Fancybox.bind("[data-fancybox='gallery']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery2']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery3']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery4']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery5']", { Hash: false });
    Fancybox.bind("[data-fancybox='gallery6']", { Hash: false });
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

  getPhotoFromVideoUrl(videoUrl: string): string {
    const videoId = videoUrl.split('/').slice(-2, -1)[0];

    return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`;
  }

  getComments(): void {
    this.#commentsService.getComments$(this.auction().data.attributes.originalAuctionCarId, this.auctionType.car, this.auctionTypesComments.lastChance).subscribe({
      next: (response) => {
        this.comments.set(response);

        //invertir el orden de los comentarios
        this.comments().data = this.comments().data.reverse();
      },
      error: (error) => {
        console.error(error);
      }
    });
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
    if (!auctionId) return;

    this.#lastChanceVehicleDetailService.getAuctionDetails$(auctionId).pipe(
      switchMap((auctionDetails) => {
        this.auction.set(auctionDetails);
        this.auctionId2.set(auctionDetails.data.id);

        if (this.authStatus === AuthStatus.authenticated) {
          this.getComments();
        }
        return this.#auctionDetailsService.getSpecificAuctionDetailsLastChance$(auctionDetails.data.attributes.originalAuctionCarId);
      })
    ).subscribe({
      next: (specificAuctionDetails) => {
        console.log({ specificAuctionDetails });

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
        console.log({ specificAuctionDetails });
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
        console.log({ offeredAmount });

        this.offeredAmount.set(offeredAmount);
        this.makeAnOfferModalIsOpen.set(true);
        return;
      }

      //Si no tiene un método de pago registrado, se abre el modal de registro de método de pago
      this.paymentMethodModalIsOpen.set(true);
    });
  }

  openBuyNowModal(): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    forkJoin({
      conditions: this.#lastChancePurchaseService.getConditions(this.auction().data.id),
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
}
