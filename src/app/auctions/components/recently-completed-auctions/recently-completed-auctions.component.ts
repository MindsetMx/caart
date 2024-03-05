import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

import { CompletedAuctionsService } from '@auctions/services/completed-auctions.service';
import { CompletedAuctions } from '@auctions/interfaces/completed-auctions';

@Component({
  selector: 'recently-completed-auctions',
  standalone: true,
  imports: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './recently-completed-auctions.component.html',
  styleUrl: './recently-completed-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyCompletedAuctionsComponent implements OnInit {
  auctionsEnded = viewChild.required<ElementRef>('auctionsEnded');

  #completedAuctionsService = inject(CompletedAuctionsService);

  completedAuctions = signal<CompletedAuctions>({} as CompletedAuctions);

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
    this.getCompletedAuctions();
  }

  getCompletedAuctions(): void {
    this.#completedAuctionsService.getCompletedAuctions$().subscribe({
      next: (data) => {
        console.log(data);
        this.completedAuctions.set(data);
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
