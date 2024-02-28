import 'moment/locale/es';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, signal, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Fancybox } from "@fancyapps/ui";
import { MomentModule } from 'ngx-moment';
import { register } from 'swiper/element/bundle';
import { switchMap } from 'rxjs';
register();
import { AppComponent } from '@app/app.component';
import { AuctionDetails, SpecificAuction, AuctionMetrics, GetComments } from '@auctions/interfaces';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CommentComponent } from '@auctions/components/comment/comment.component';
import { CommentsService } from '@auctions/services/comments.service';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { CountdownService } from '@shared/services/countdown.service';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';
import { InputDirective, PrimaryButtonDirective, SecondaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { MakeAnOfferModalComponent } from '@auctions/modals/make-an-offer-modal/make-an-offer-modal.component';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { LastChanceVehicleDetailService } from '@app/last-chance/services/last-chance-vehicle-detail.service';
import { LastChanceAuctionVehicleDetail } from '@app/last-chance/interfaces';

@Component({
  selector: 'app-last-chance-detail',
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
    SecondaryButtonDirective,
    TertiaryButtonDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './last-chance-detail.component.html',
  styleUrl: './last-chance-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceDetailComponent implements AfterViewInit {
  @ViewChild('videoGallery') videoGallery!: ElementRef;
  @ViewChild('auctionsEnded') auctionsEnded!: ElementRef;

  makeAnOfferModalIsOpen = signal<boolean>(false);
  auction = signal<LastChanceAuctionVehicleDetail>({} as LastChanceAuctionVehicleDetail);
  specificAuction = signal<SpecificAuction>({} as SpecificAuction);
  metrics = signal<AuctionMetrics>({} as AuctionMetrics);
  isFollowing = signal<boolean | undefined>(undefined);
  paymentMethodModalIsOpen = signal<boolean>(false);
  paymentMethods = signal<PaymentMethod[]>([] as PaymentMethod[]);
  comments = signal<GetComments>({} as GetComments);
  auctionId = signal<string | null>(null);

  #route = inject(ActivatedRoute);
  #lastChanceVehicleDetailService = inject(LastChanceVehicleDetailService);
  #countdownService = inject(CountdownService);
  #auctionFollowService = inject(AuctionFollowService);
  #authService = inject(AuthService);
  #appComponent = inject(AppComponent);
  #generalInfoService = inject(GeneralInfoService);
  #commentsService = inject(CommentsService);

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

        break;
      case AuthStatus.notAuthenticated:
        this.getAuctionDetails(this.auctionId());
        break;
    }
  });

  constructor() {
    this.auctionId.set(this.#route.snapshot.paramMap.get('id'));
  }

  ngAfterViewInit(): void {
    this.initSwiperCarousel(this.videoGallery, this.swiperParams);
    this.initSwiperCarousel(this.auctionsEnded, this.swiperParams);

    Fancybox.bind("[data-fancybox='gallery']");
    Fancybox.bind("[data-fancybox='gallery2']");
    Fancybox.bind("[data-fancybox='gallery3']");
    Fancybox.bind("[data-fancybox='gallery4']");
    Fancybox.bind("[data-fancybox='gallery5']");
    Fancybox.bind("[data-fancybox='gallery6']");
  }

  getComments(): void {
    this.#commentsService.getComments(this.auction().carHistory.originalAuctionCarId).subscribe({
      next: (response) => {
        this.comments.set(response);
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

    this.#lastChanceVehicleDetailService.getMetrics$(auctionId).subscribe({
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
        console.log({ auctionDetails });
        this.auction.set(auctionDetails);
        if (this.authStatus === AuthStatus.authenticated) {
          this.getComments();
        }
        return this.#lastChanceVehicleDetailService.getSpecificAuctionDetails$(auctionDetails.carHistory.originalAuctionCarId);
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
    this.#lastChanceVehicleDetailService.getSpecificAuctionDetails$(this.auction().carHistory.originalAuctionCarId).subscribe({
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

  // countdownConfig(): CountdownConfig {
  //   let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
  //   return {
  //     leftTime: leftTime,
  //     format: this.getFormat(leftTime)
  //   };
  // }

  // countdownConfig2(): CountdownConfig {
  //   let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
  //   return {
  //     leftTime: leftTime,
  //     format: this.getFormat2(leftTime)
  //   };
  // }

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
    this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
      this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);

      if (this.paymentMethods().length > 0) {
        this.makeAnOfferModalIsOpen.set(true);
        return;
      }

      //Si no tiene un método de pago registrado, se abre el modal de registro de método de pago
      this.paymentMethodModalIsOpen.set(true);
    });
  }

  refreshPaymentMethods(): void {
    this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
      this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);
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
