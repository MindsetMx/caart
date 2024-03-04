import 'moment/locale/es';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, signal, inject, effect, viewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Fancybox } from "@fancyapps/ui";
import { MomentModule } from 'ngx-moment';
import { register } from 'swiper/element/bundle';
import { switchMap } from 'rxjs';
register();

import { AuctionDetails, AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CountdownService } from '@shared/services/countdown.service';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';
import { InputDirective } from '@shared/directives/input.directive';
import { MakeAnOfferModalComponent } from '@auctions/modals/make-an-offer-modal/make-an-offer-modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { AppComponent } from '@app/app.component';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { CommentsService } from '@auctions/services/comments.service';
import { GetComments } from '@auctions/interfaces/get-comments';
import { PaymentMethodsService } from '../../../shared/services/payment-methods.service';
import { environments } from '@env/environments';

@Component({
  selector: 'app-auction',
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
    CommentComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionComponent implements AfterViewInit {
  readonly #baseUrl = environments.baseUrl;

  videoGallery = viewChild<ElementRef>('videoGallery');
  @ViewChild('auctionsEnded') auctionsEnded!: ElementRef;

  makeAnOfferModalIsOpen = signal<boolean>(false);
  auction = signal<AuctionDetails>({} as AuctionDetails);
  auctionId2 = signal<string | null>(null);
  specificAuction = signal<SpecificAuction>({} as SpecificAuction);
  metrics = signal<AuctionMetrics>({} as AuctionMetrics);
  isFollowing = signal<boolean | undefined>(undefined);
  paymentMethodModalIsOpen = signal<boolean>(false);
  // paymentMethods = signal<PaymentMethod[]>([] as PaymentMethod[]);
  comments = signal<GetComments>({} as GetComments);
  auctionId = signal<string | null>(null);
  paymentMethodId = signal<string>('');
  eventSource?: EventSource;

  #route = inject(ActivatedRoute);
  #auctionDetailsService = inject(AuctionDetailsService);
  #countdownService = inject(CountdownService);
  #auctionFollowService = inject(AuctionFollowService);
  #authService = inject(AuthService);
  #appComponent = inject(AppComponent);
  // #generalInfoService = inject(GeneralInfoService);
  #commentsService = inject(CommentsService);
  #paymentMethodsService = inject(PaymentMethodsService);

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
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

  authStatusEffect = effect(() => {
    switch (this.authStatus) {
      case AuthStatus.authenticated:
        this.getAuctionDetails(this.auctionId());
        this.getMetrics(this.auctionId());

        this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe-auction/${this.auctionId2()}`);

        this.eventSource.onmessage = (event) => {
          console.log({ message: JSON.parse(event.data) });
          if (JSON.parse(event.data).type !== 'INITIAL_CONNECTION') {
            this.getSpecificAuctionDetails();
          }
        };
        break;
      case AuthStatus.notAuthenticated:
        this.getAuctionDetails(this.auctionId());
        break;
    }
  });

  videoGalleryEffect = effect(() => {
    if (this.videoGallery) {
      this.initSwiperCarousel(this.videoGallery(), this.swiperParams);
    }
  });

  constructor() {
    this.auctionId.set(this.#route.snapshot.paramMap.get('id'));
  }

  ngAfterViewInit(): void {
    // this.initSwiperCarousel(this.videoGallery, this.swiperParams);
    this.initSwiperCarousel(this.auctionsEnded, this.swiperParams);

    Fancybox.bind("[data-fancybox='gallery']");
    Fancybox.bind("[data-fancybox='gallery2']");
    Fancybox.bind("[data-fancybox='gallery3']");
    Fancybox.bind("[data-fancybox='gallery4']");
    Fancybox.bind("[data-fancybox='gallery5']");
    Fancybox.bind("[data-fancybox='gallery6']");
  }

  getPhotoFromVideoUrl(videoUrl: string): string {
    const videoId = videoUrl.split('/').pop()?.split('.').shift();
    return `https://res.cloudinary.com/dfadvv7yu/video/upload/so_0,w_1920,h_1080,c_fill/${videoId}.jpg`;
  }

  getComments(): void {
    this.#commentsService.getComments(this.auction().data.attributes.originalAuctionCarId).subscribe({
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

  followAuction(auctionId: string): void {
    this.#auctionFollowService.followAuction$(auctionId).subscribe({
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
    this.#auctionFollowService.unfollowAuction$(auctionId).subscribe({
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

    this.#auctionDetailsService.getAuctionDetails$(auctionId).pipe(
      switchMap((auctionDetails) => {
        this.auction.set(auctionDetails);
        this.auctionId2.set(auctionDetails.data.id);
        if (this.authStatus === AuthStatus.authenticated) {
          this.getComments();
        }
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

  countdownConfig(): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime)
    };
  }

  countdownConfig2(): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat2(leftTime)
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

  openMakeAnOfferModal(): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    //Si tiene un método de pago registrado, se abre el modal
    this.#paymentMethodsService.getPaymentMethods$().subscribe((paymentMethods) => {
      console.log({ paymentMethods });

      if (paymentMethods.data.length > 0) {
        this.paymentMethodId.set(paymentMethods.data[0].id);
        console.log({ paymentMethodId: this.paymentMethodId() });
        this.makeAnOfferModalIsOpen.set(true);
        return;
      }
      // this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);

      // if (this.paymentMethods().length > 0) {
      //   this.makeAnOfferModalIsOpen.set(true);
      //   return;
      // }

      //Si no tiene un método de pago registrado, se abre el modal de registro de método de pago
      this.paymentMethodModalIsOpen.set(true);
    });
  }

  refreshPaymentMethods(): void {
    // this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
    //   this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);
    // });

    this.#paymentMethodsService.getPaymentMethods$().subscribe((paymentMethods) => {
      this.paymentMethodId.set(paymentMethods.data[0].id);
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
