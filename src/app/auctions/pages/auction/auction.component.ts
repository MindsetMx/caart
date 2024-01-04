import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { register } from 'swiper/element/bundle';

register();

import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { InputDirective } from '@shared/directives/input.directive';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [
    InputDirective,
    PrimaryButtonDirective,
    StarComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionComponent implements AfterViewInit {
  @ViewChild('videoGallery') videoGallery!: ElementRef;
  @ViewChild('auctionsEnded') auctionsEnded!: ElementRef;

  externalPhotoGalleryLength: number = 7;
  internalPhotoGalleryLength: number = 7;
  mechanicalPhotoGalleryLength: number = 7;
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < 768; // Actualiza el valor en tiempo real
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

  incrementExternalPhotoGalleryLength(): void {
    if (!this.isMobile) return;

    this.externalPhotoGalleryLength += 8;
  }

  incrementInternalPhotoGalleryLength(): void {
    if (!this.isMobile) return;

    this.internalPhotoGalleryLength += 8;
  }

  incrementMechanicalPhotoGalleryLength(): void {
    if (!this.isMobile) return;

    this.mechanicalPhotoGalleryLength += 8;
  }

  initSwiperCarousel(swiperEl: ElementRef | undefined, swiperParams: any): void {
    if (!swiperEl) return;

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl.nativeElement, swiperParams);

    // and now initialize it
    swiperEl.nativeElement.initialize();
  }

}
