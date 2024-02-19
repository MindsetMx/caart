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
import { AuctionDetails, SpecificAuction } from '@auctions/interfaces';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { CountdownService } from '@shared/services/countdown.service';
import { switchMap } from 'rxjs';
import { MomentModule } from 'ngx-moment';
import { ImageGalleryComponent } from '@auctions/components/image-gallery/image-gallery.component';

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

  hours = signal<number>(2);
  minutes = signal<number>(58);
  seconds = signal<number>(4);

  externalPhotoGalleryLength: number = 7;
  internalPhotoGalleryLength: number = 7;
  mechanicalPhotoGalleryLength: number = 7;

  makeAnOfferModalIsOpen = signal<boolean>(false);
  auction = signal<AuctionDetails>({} as AuctionDetails);
  specificAuction = signal<SpecificAuction>({} as any);

  #route = inject(ActivatedRoute);
  #auctionDetailsService = inject(AuctionDetailsService);
  #countdownService = inject(CountdownService);

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
      format: this.getFormat3(leftTime)
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

  getFormat2(seconds: number): string {
    return this.#countdownService.getFormat2(seconds);
  }

  getFormat3(seconds: number): string {
    return this.#countdownService.getFormat3(seconds);
  }

  openMakeAnOfferModal(): void {
    this.makeAnOfferModalIsOpen.set(true);
  }

  // incrementExternalPhotoGalleryLength(): void {
  //   console.log('incrementExternalPhotoGalleryLength');

  //   if (!this.isMobile) return;

  //   this.externalPhotoGalleryLength += 8;
  // }

  // incrementInternalPhotoGalleryLength(): void {
  //   if (!this.isMobile) return;

  //   this.internalPhotoGalleryLength += 8;
  // }

  // incrementMechanicalPhotoGalleryLength(): void {
  //   if (!this.isMobile) return;

  //   this.mechanicalPhotoGalleryLength += 8;
  // }

  initSwiperCarousel(swiperEl: ElementRef | undefined, swiperParams: any): void {
    if (!swiperEl) return;

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl.nativeElement, swiperParams);

    // and now initialize it
    swiperEl.nativeElement.initialize();
  }

}
