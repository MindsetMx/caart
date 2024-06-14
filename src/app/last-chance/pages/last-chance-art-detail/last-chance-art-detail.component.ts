import { ActivatedRoute } from '@angular/router';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { forkJoin, switchMap } from 'rxjs';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';

import { AppComponent } from '@app/app.component';
import { ArtAuctionDetailsService } from '@auctions/services/art-auction-details.service';
import { ArtAuctionImageAssigmentAndReorderService } from '@dashboard/services/art-auction-image-assigment-and-reorder.service';
import { ArtImagesPublish } from '@app/dashboard/interfaces';
import { ArtMetrics } from '@auctions/interfaces/art-metrics';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuctionTypes, AuctionTypesComments } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CommentsService } from '@auctions/services/comments.service';
import { CountdownService } from '@shared/services/countdown.service';
import { environments } from '@env/environments';
import { ArtAuctionDetails, GetComments, SpecificArtAuction } from '@auctions/interfaces';
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
import { LastChanceAuctionArtDetail } from '@app/last-chance/interfaces';
import { TwoColumnAuctionGridComponent } from '@auctions/components/two-column-auction-grid/two-column-auction-grid.component';
import { AuctionDetailsTableComponentComponent } from '@auctions/components/auction-details-table-component/auction-details-table-component.component';
import { LastChanceBidModalComponent } from '@auctions/modals/last-chance-bid-modal/last-chance-bid-modal.component';
import { LastChanceBuyNowModalComponent } from '@auctions/modals/last-chance-buy-now-modal/last-chance-buy-now-modal.component';
import { LastChanceArtPurchaseService } from '@app/last-chance/services/last-chance-art-purchase.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    StarComponent,
    CommentsTextareaComponent,
    PrimaryButtonDirective,
    CommentComponent,
    AuctionSummaryComponent,
    MomentModule,
    LastChanceBidModalComponent,
    PaymentMethodModalComponent,
    AuctionCancelledComponent,
    TwoColumnAuctionGridComponent,
    AuctionDetailsTableComponentComponent,
    LastChanceBuyNowModalComponent
  ],
  templateUrl: './last-chance-art-detail.component.html',
  styleUrl: './last-chance-art-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceArtDetailComponent {
  myCarousel = viewChild<ElementRef>('myCarousel');

  readonly #baseUrl = environments.baseUrl;

  auction = signal<LastChanceAuctionArtDetail>({} as LastChanceAuctionArtDetail);
  auctionId = signal<string | null>(null);
  auctionId2 = signal<string | null>(null);
  specificAuction = signal<SpecificArtAuction>({} as SpecificArtAuction);
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
    switch (this.authStatus) {
      case AuthStatus.authenticated:
        this.getMetrics(this.auctionId());

        break;
    }
  });

  auctionEffect = effect(() => {
    if (this.auction().data) {
      untracked(() => {
        this.auctionDetails.set([
          { label: 'Artista', value: this.auction().data.attributes.auctionArtForm.artist },
          { label: 'Año', value: this.auction().data.attributes.auctionArtForm.year },
          { label: 'Materiales', value: this.auction().data.attributes.auctionArtForm.materials },
          { label: 'Rareza', value: this.auction().data.attributes.auctionArtForm.rarity },
          { label: 'Dimensiones', value: `${this.auction().data.attributes.auctionArtForm.height} x ${this.auction().data.attributes.auctionArtForm.width} x ${this.auction().data.attributes.auctionArtForm.depth}` },
          { label: 'Condición', value: this.auction().data.attributes.auctionArtForm.condition },
          { label: 'Origen', value: this.auction().data.attributes.auctionArtForm.origin },
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

  imagesPublishEffect = effect(() => {
    if (this.imagesPublish().data && this.imagesPublish().data.fotosCarrusel.length > 0 && this.myCarousel()) {
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

  constructor() {
    this.#route.paramMap.subscribe(params => {
      let id = params.get('id');

      this.auctionId.set(id);
      this.getAuctionDetails(id);
      this.getImagesPublish(id!);
    });
  }

  openBuyNowModal(): void {
    console.log('openBuyNowModal');

    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    console.log('openBuyNowModal 2');


    forkJoin({
      conditions: this.#lastChanceArtPurchaseService.getConditions(this.auction().data.id),
      paymentMethods: this.#paymentMethodsService.getPaymentMethods$()
    }).subscribe(({ conditions, paymentMethods }) => {
      console.log('openBuyNowModal 3');
      console.log({ conditions, paymentMethods });


      this.comission.set(conditions.data.commission);
      this.reserveAmount.set(conditions.data.reserveAmount);

      if (paymentMethods.data.length > 0) {
        console.log('openBuyNowModal 4');

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

    this.#lastChanceArtDetailService.getAuctionDetails$(auctionId).pipe(
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

  getSpecificAuctionDetails(): void {
    this.#artAuctionDetailsService.getSpecificAuctionDetails$(this.auction().data.attributes.carHistory.originalAuctionArtId).subscribe({
      next: (specificAuctionDetails) => {
        this.specificAuction.set(specificAuctionDetails);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getComments(): void {
    this.#commentsService.getComments$(this.auction().data.attributes.carHistory.originalAuctionArtId, this.auctionType.art, this.auctionTypesComments.lastChance).subscribe({
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

  countdownConfig(): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime)
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
}
