import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild, WritableSignal, effect, inject, signal, viewChild, PLATFORM_ID } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { VehicleFilterService } from '@auctions/services/vehicle-filter.service';
import { GetAllAuctions, MemorabiliaAuction, VehicleAuction, VehicleAuctionData } from '@auctions/interfaces';
import { AuctionCard2Component } from '@auctions/components/auction-card2/auction-card2.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { AuctionMemorabiliaCardComponent } from '@auctions/components/auction-memorabilia-card/auction-memorabilia-card.component';
import { MemorabiliaFilterService } from '@auctions/services/memorabilia-filter.service';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { PrimaryButtonDirective } from '@shared/directives';
import { RegisterModalComponent } from '@auth/modals/register-modal/register-modal.component';
import { ArtAuctionCardComponent } from '@auctions/components/art-auction-card/art-auction-card.component';
import { AuctionCardComponent } from '@auctions/components/auction-card/auction-card.component';
import { GetAllAuctionsService } from '@auctions/services/all-auctions.service';
import { AuctionTypesAll } from '@auctions/enums';
import { SeoService } from '@shared/services/seo.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    SecondaryButtonDirective,
    RouterLink,
    CommonModule,
    AuctionCard2Component,
    CountdownModule,
    FollowButtonComponent,
    AuctionMemorabiliaCardComponent,
    PrimaryButtonDirective,
    RegisterModalComponent,
    ArtAuctionCardComponent,
    AuctionCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;
  carousel2 = viewChild.required<ElementRef>('carousel2');
  auctionsPagination = viewChild.required<ElementRef>('auctionsPagination');

  isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  #vehicleFilterService = inject(VehicleFilterService);
  #memorabiliaFilterService = inject(MemorabiliaFilterService);

  auctions = signal<GetAllAuctions>({} as GetAllAuctions);
  memorabiliaAuctions = signal<MemorabiliaAuction>({} as MemorabiliaAuction);
  registerModalIsOpen = signal<boolean>(false);

  currentIndex = signal<number>(0);

  #countdownService = inject(CountdownService);
  #allAuctionsService = inject(GetAllAuctionsService);
  #seoService = inject(SeoService);
  #platformId = inject(PLATFORM_ID);

  get auctionTypesAll(): typeof AuctionTypesAll {
    return AuctionTypesAll;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768; // Actualiza el valor en tiempo real
    }
  }

  ngOnInit(): void {
    this.setupHomepageSeo();
    this.getLiveAuctions();
    // this.getMemorabiliaLiveAuctions();
  }

  private setupHomepageSeo(): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    this.#seoService.updateSeo({
      title: 'Caart - Subastas Premium de Arte, Automóviles y Memorabilia',
      description: 'Descubre subastas exclusivas de arte contemporáneo, automóviles clásicos y memorabilia deportiva. Únete a la plataforma líder en subastas premium con autenticidad garantizada y proceso seguro.',
      keywords: 'subastas en vivo, arte contemporáneo, carros clásicos, memorabilia deportiva, coleccionables, subastas online México, vehículos vintage, arte mexicano',
      url: this.#seoService.getCurrentUrl(),
      canonical: this.#seoService.getCanonicalUrl('/'),
      type: 'website'
    });

    // Add ItemList structured data for featured auctions
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Subastas Destacadas - Caart',
      description: 'Descubre las mejores subastas de arte, automóviles y memorabilia',
      url: 'https://caart.com',
      numberOfItems: 0
    };

    this.#seoService.addStructuredData(itemListSchema);
  }

  carousel2Effect = effect(() => {
    if (typeof window === 'undefined') return; // Skip on server-side

    const swiperEl = this.carousel2().nativeElement;

    // swiper parameters
    const swiperParams = {
      injectStyles: [
        `
        .swiper-pagination-bullet-active {
          background-color: black;
        }
        .swiper-wrapper {
          padding-bottom: 2.5rem;
        }
        @media (min-width: 640px) {
          .swiper-wrapper {
            display: flex;
            align-items: end;
        }
      }
        `,
      ],
      pagination: true,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      spaceBetween: 20,
      // autoplay: {
      //   delay: 5000
      // },
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();

    this.carousel2().nativeElement.swiper.on('slideChangeTransitionEnd', () => {
      this.currentIndex.set(this.carousel2().nativeElement.swiper.activeIndex);
    });
  });

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return; // Skip on server-side

    const swiperEl = this.carousel.nativeElement;

    // swiper parameters
    const swiperParams = {
      injectStyles: [
        `
        .swiper-pagination-bullet{
          background-color: transparent;
          border: 1px solid #d9d9d9;
          width: 6px;
          height: 6px;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          width: 6px;
          height: 6px;
          background-color: white;
        }
        `,
      ],
      pagination: true,
      autoplay: {
        delay: 8000
      },
      loop: true,
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();

    this.carousel.nativeElement.swiper.on('slideChangeTransitionEnd', () => {
      this.currentIndex.set(this.carousel.nativeElement.swiper.activeIndex);
    });
  }

  openRegisterModal(): void {
    this.registerModalIsOpen.set(true);
  }

  getLiveAuctions(): void {
    this.#allAuctionsService.getAllLiveAuctions$(
      1,
      20,
      'EndingSoonest',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ).subscribe({
      next: (auctions: GetAllAuctions) => {
        this.auctions.set(auctions);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // getLiveAuctions(): void {
  //   this.#vehicleFilterService.getLiveAuctions$(
  //     1,
  //     3,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     'EndingSoonest'
  //   ).subscribe({
  //     next: (auctions: VehicleAuction) => {
  //       this.auctions.set(auctions);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  // }

  getMemorabiliaLiveAuctions(): void {
    this.#memorabiliaFilterService.getLiveAuctions$(
      1,
      3,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'EndingSoonest'
    ).subscribe({
      next: (auctions: MemorabiliaAuction) => {
        this.memorabiliaAuctions.set(auctions);
        return;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  countdownConfig(auction: VehicleAuctionData): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(auction.attributes.endDate);
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
}
