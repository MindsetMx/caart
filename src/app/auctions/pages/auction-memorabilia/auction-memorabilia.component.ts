import 'moment/locale/es';
import { ActivatedRoute } from '@angular/router';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, signal, inject, effect, viewChild, OnDestroy, WritableSignal } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { MomentModule } from 'ngx-moment';
import { register } from 'swiper/element/bundle';
import { switchMap } from 'rxjs';
register();

import { AppComponent } from '@app/app.component';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuctionMemorabiliaDetails } from '@auctions/interfaces/auction-memorabilia-details';
import { AuctionMemorabiliaMetrics, GetComments, SpecificMemorabiliaAuction } from '@auctions/interfaces';
import { AuctionSummaryComponent } from '@auctions/components/auction-summary/auction-summary.component';
import { AuctionTypesComments } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CurrentAuctionsComponent } from '@auctions/components/current-auctions/current-auctions.component';
import { CurrentMemorabiliaAuctionsComponent } from '@auctions/components/current-memorabilia-auctions/current-memorabilia-auctions.component';
import { environments } from '@env/environments';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { MakeAnOfferModalComponent } from '@auctions/modals/make-an-offer-modal/make-an-offer-modal.component';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { RecentlyCompletedAuctionsComponent } from '@auctions/components/recently-completed-auctions/recently-completed-auctions.component';
import { RecentlyCompletedMemorabiliaAuctionComponent } from '@auctions/components/recently-completed-memorabilia-auctions/recently-completed-memorabilia-auctions.component';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { NoReserveTagComponentComponent } from '@auctions/components/no-reserve-tag-component/no-reserve-tag-component.component';
import { MatPaginator } from '@angular/material/paginator';
import { AuctionCarStatus } from '@dashboard/interfaces';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    MakeAnOfferModalComponent,
    PrimaryButtonDirective,
    StarComponent,
    SlicePipe,
    CurrencyPipe,
    CountdownModule,
    MomentModule,
    ImageGalleryComponent,
    PaymentMethodModalComponent,
    CommentsTextareaComponent,
    CommentComponent,
    RecentlyCompletedAuctionsComponent,
    AuctionSummaryComponent,
    CurrentAuctionsComponent,
    CurrentMemorabiliaAuctionsComponent,
    RecentlyCompletedMemorabiliaAuctionComponent,
    NoReserveTagComponentComponent,
    MatPaginator,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction-memorabilia.component.html',
  styleUrl: './auction-memorabilia.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionMemorabiliaComponent {
  readonly #baseUrl = environments.baseUrl;

  videoGallery = viewChild<ElementRef>('videoGallery');

  auction = signal<AuctionMemorabiliaDetails>({} as AuctionMemorabiliaDetails);
  auctionId = signal<string | null>(null);
  auctionId2 = signal<string | null>(null);
  comments = signal<GetComments>({} as GetComments);
  eventSource?: EventSource;
  isFollowing = signal<boolean | undefined>(undefined);
  makeAnOfferModalIsOpen = signal<boolean>(false);
  metrics = signal<AuctionMemorabiliaMetrics>({} as AuctionMemorabiliaMetrics);
  paymentMethodId = signal<string>('');
  paymentMethodModalIsOpen = signal<boolean>(false);
  specificAuction = signal<SpecificMemorabiliaAuction>({} as SpecificMemorabiliaAuction);
  offeredAmount = signal<number | undefined>(undefined);
  newOfferMade = signal<number>(0);

  page = signal<number>(1);
  size = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);

  #appComponent = inject(AppComponent);
  #auctionDetailsService = inject(AuctionDetailsService);
  #auctionFollowService = inject(AuctionFollowService);
  #authService = inject(AuthService);
  #commentsService = inject(CommentsService);
  #countdownService = inject(CountdownService);
  #paymentMethodsService = inject(PaymentMethodsService);
  #route = inject(ActivatedRoute);

  auctionCarStatus = AuctionCarStatus;

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
    this.getMetrics(this.auctionId());
  });

  videoGalleryEffect = effect(() => {
    if (this.videoGallery) {
      this.initSwiperCarousel(this.videoGallery(), this.swiperParams);
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
      };
    }
  });

  constructor() {
    this.auctionId.set(this.#route.snapshot.paramMap.get('id'));

    this.#route.paramMap.subscribe(params => {
      let id = params.get('id');

      this.auctionId.set(id);
      this.getAuctionDetails(id);
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

  makeAnOfferModalIsOpenChanged(isOpen: boolean): void {
    this.makeAnOfferModalIsOpen.set(isOpen);
  }

  getPhotoFromVideoUrl(videoUrl: string): string {
    const videoId = videoUrl.split('/').pop()?.split('.').shift();
    return `https://res.cloudinary.com/dfadvv7yu/video/upload/so_0,w_1920,h_1080,c_fill/${videoId}.jpg`;
  }

  getComments(): void {
    this.#commentsService.getComments$(this.auction().data.attributes.originalMemorabiliaId, AuctionTypes.memorabilia, this.auctionTypesComments.active, this.page(), this.size()).subscribe({
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

  followAuction(auctionId: string): void {
    this.#auctionFollowService.followAuction$(auctionId, AuctionTypes.memorabilia).subscribe({
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
    this.#auctionFollowService.unfollowAuction$(auctionId, AuctionTypes.memorabilia).subscribe({
      next: (response) => {
        this.getMetrics(auctionId);
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
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

  getMetrics(auctionId: string | null): void {
    if (!auctionId) return;

    this.#auctionDetailsService.getMemorabiliaMetrics$(auctionId).subscribe({
      next: (metrics: AuctionMemorabiliaMetrics) => {
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

    this.#auctionDetailsService.getMemorabiliaAuctionDetails$(auctionId).pipe(
      switchMap((auctionDetails) => {
        this.auction.set(auctionDetails);
        this.auctionId2.set(auctionDetails.data.id);
        if (this.authStatus === AuthStatus.authenticated) {
          this.getComments();
        }
        return this.#auctionDetailsService.getSpecificMemorabiliaAuctionDetails$(auctionDetails.data.attributes.originalMemorabiliaId);
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
    this.#auctionDetailsService.getSpecificMemorabiliaAuctionDetails$(this.auction().data.attributes.originalMemorabiliaId).subscribe({
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
}
