import { ActivatedRoute } from '@angular/router';
import 'moment/locale/es';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild, signal, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { Fancybox } from "@fancyapps/ui";
import { register } from 'swiper/element/bundle';
register();

import { InputDirective } from '@shared/directives/input.directive';
import { MakeAnOfferModalComponent } from '@auctions/modals/make-an-offer-modal/make-an-offer-modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionDetails, AuctionMetrics, SpecificAuction } from '@auctions/interfaces';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { CountdownService } from '@shared/services/countdown.service';
import { switchMap } from 'rxjs';
import { MomentModule } from 'ngx-moment';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';

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
    ImageGalleryComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionComponent implements OnInit, AfterViewInit {
  @ViewChild('videoGallery') videoGallery!: ElementRef;
  @ViewChild('auctionsEnded') auctionsEnded!: ElementRef;

  makeAnOfferModalIsOpen = signal<boolean>(false);
  auction = signal<AuctionDetails>({} as AuctionDetails);
  specificAuction = signal<SpecificAuction>({} as SpecificAuction);
  metrics = signal<AuctionMetrics>({} as AuctionMetrics);

  isFollowing = signal<boolean | undefined>(undefined);

  #route = inject(ActivatedRoute);
  #auctionDetailsService = inject(AuctionDetailsService);
  #countdownService = inject(CountdownService);
  #auctionFollowService = inject(AuctionFollowService);

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

  ngOnInit() {
    const auctionId = this.#route.snapshot.paramMap.get('id');

    this.getAuctionDetails(auctionId);
    this.getMetrics(auctionId);
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

  followAuction(auctionId: string): void {
    this.#auctionFollowService.followAuction$(auctionId).subscribe({
      next: (response) => {
        this.isFollowing.set(response.data.attributes.isFollowing);
        // this.getAuctionDetails(auctionId);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  unfollowAuction(auctionId: string): void {
    this.#auctionFollowService.unfollowAuction$(auctionId).subscribe({
      next: (response) => {
        this.isFollowing.set(response.data.attributes.isFollowing);
        // this.getAuctionDetails(auctionId);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  followOrUnfollowAuction(auctionId: string): void {
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
    this.makeAnOfferModalIsOpen.set(true);
  }

  initSwiperCarousel(swiperEl: ElementRef | undefined, swiperParams: any): void {
    if (!swiperEl) return;

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl.nativeElement, swiperParams);

    // and now initialize it
    swiperEl.nativeElement.initialize();
  }

}
