import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleFilterService } from '@auctions/services/vehicle-filter.service';
import { MemorabiliaAuction, VehicleAuction, VehicleAuctionData } from '@auctions/interfaces';
import { AuctionCard2Component } from '@auctions/components/auction-card2/auction-card2.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { AuctionMemorabiliaCardComponent } from '@auctions/components/auction-memorabilia-card/auction-memorabilia-card.component';
import { MemorabiliaFilterService } from '@auctions/services/memorabilia-filter.service';
import { AuctionTypes } from '@auctions/enums/auction-types';

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
    AuctionMemorabiliaCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;

  isMobile = window.innerWidth < 768;

  #vehicleFilterService = inject(VehicleFilterService);
  #memorabiliaFilterService = inject(MemorabiliaFilterService);

  auctions = signal<VehicleAuction>({} as VehicleAuction);
  memorabiliaAuctions = signal<MemorabiliaAuction>({} as MemorabiliaAuction);

  currentIndex = signal<number>(0);

  #countdownService = inject(CountdownService);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < 768; // Actualiza el valor en tiempo real
  }

  ngOnInit(): void {
    this.getLiveAuctions();
    this.getMemorabiliaLiveAuctions();
  }

  ngAfterViewInit(): void {
    const swiperEl = this.carousel.nativeElement;

    // swiper parameters
    const swiperParams = {
      injectStyles: [
        `
        .swiper-pagination-bullet{
          background-color: #d9d9d9;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          width: 6px;
          height: 6px;
          background-color: transparent;
          border: 1px solid #d9d9d9;
        }
        `,
      ],
      pagination: true,
      // autoplay: {
      //   delay: 5000
      // },
      // loop: true,
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();

    this.carousel.nativeElement.swiper.on('slideChangeTransitionEnd', () => {
      this.currentIndex.set(this.carousel.nativeElement.swiper.activeIndex);
    });
  }

  getLiveAuctions(): void {
    this.#vehicleFilterService.getLiveAuctions$(
      1,
      3,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'EndingSoonest'
    ).subscribe({
      next: (auctions: VehicleAuction) => {
        console.log({ auctions });

        this.auctions.set(auctions);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

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
        console.log({ auctions });

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
