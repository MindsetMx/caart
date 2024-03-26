import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, signal, viewChild } from '@angular/core';
import { RecentlyCompletedMemorabiliaAuctionsService } from '../../services/recently-completed-memorabilia-auctions.service';
import { register } from 'swiper/element/bundle';
import { RecentlyCompletedMemorabiliaAuctions } from '@auctions/interfaces/recently-completed-memorabilia-auctions';
register();

@Component({
  selector: 'recently-completed-memorabilia-auctions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './recently-completed-memorabilia-auctions.component.html',
  styleUrl: './recently-completed-memorabilia-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyCompletedMemorabiliaAuctionComponent {
  auctionsEnded = viewChild.required<ElementRef>('auctionsEnded');

  auctionId = input.required<string>();

  #recentlyCompletedCarAuctionsService = inject(RecentlyCompletedMemorabiliaAuctionsService);

  completedAuctions = signal<RecentlyCompletedMemorabiliaAuctions>({} as RecentlyCompletedMemorabiliaAuctions);

  auctionsEndedEffect = effect(() => {
    this.initSwiperCarousel(this.auctionsEnded(), this.swiperParams);
  });

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

  ngOnInit(): void {
    this.getRecentlyCompletedCarAuctions();
  }

  getRecentlyCompletedCarAuctions(): void {
    this.#recentlyCompletedCarAuctionsService.getRecentlyCompletedMemorabiliaAuctions$(1, 10).subscribe({
      next: (recentlyCompletedCarAuctions) => {
        console.log(recentlyCompletedCarAuctions);
        this.completedAuctions.set(recentlyCompletedCarAuctions);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  initSwiperCarousel(swiperEl: ElementRef | undefined, swiperParams: any): void {
    if (!swiperEl) return;

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl.nativeElement, swiperParams);

    // and now initialize it
    swiperEl.nativeElement.initialize();
  }
}
