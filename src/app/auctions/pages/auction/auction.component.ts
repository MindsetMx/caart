import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { Fancybox } from "@fancyapps/ui";
import { register } from 'swiper/element/bundle';

register();

import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { InputDirective } from '@shared/directives/input.directive';
import { MakeAnOfferModalComponent } from '../../modals/make-an-offer-modal/make-an-offer-modal.component';
import { Subscription, interval } from 'rxjs';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [
    InputDirective,
    MakeAnOfferModalComponent,
    PrimaryButtonDirective,
    StarComponent,
    SlicePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoGallery') videoGallery!: ElementRef;
  @ViewChild('auctionsEnded') auctionsEnded!: ElementRef;

  hours: WritableSignal<number> = signal(2);
  minutes: WritableSignal<number> = signal(58);
  seconds: WritableSignal<number> = signal(4);
  private timerSubscription?: Subscription;

  externalPhotoGalleryLength: number = 7;
  internalPhotoGalleryLength: number = 7;
  mechanicalPhotoGalleryLength: number = 7;

  makeAnOfferModalIsOpen: WritableSignal<boolean> = signal(false);

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

  ngOnInit() {
    const timer = interval(1000);
    this.timerSubscription = timer.subscribe(() => {
      this.updateTimer();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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

  private updateTimer() {
    if (this.seconds() > 0) {
      this.seconds.set(this.seconds() - 1);
    } else {
      if (this.minutes() > 0) {
        this.minutes.set(this.minutes() - 1);
        this.seconds.set(59);
      } else {
        if (this.hours() > 0) {
          this.hours.set(this.hours() - 1);
          this.minutes.set(59);
          this.seconds.set(59);
        } else {
          // El contador ha llegado a cero, puedes tomar acciones adicionales aquí.
          this.timerSubscription?.unsubscribe(); // Detener el contador
        }
      }
    }
  }

  // Función para formatear números con ceros a la izquierda
  formatNumber(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  openMakeAnOfferModal(): void {
    this.makeAnOfferModalIsOpen.set(true);
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
