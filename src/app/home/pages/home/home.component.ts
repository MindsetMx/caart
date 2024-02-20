import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild, inject, signal } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleFilterService } from '@auctions/services/vehicle-filter.service';
import { VehicleAuction } from '@auctions/interfaces';
import { AuctionCard2Component } from '@auctions/components/auction-card2/auction-card2.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    SecondaryButtonDirective,
    RouterLink,
    CommonModule,
    AuctionCard2Component
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

  auctions = signal<VehicleAuction>({} as VehicleAuction);

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < 768; // Actualiza el valor en tiempo real
  }

  ngOnInit(): void {
    this.getLiveAuctions();
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
      autoplay: {
        delay: 5000
      },
      loop: true,
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();
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
        this.auctions.set(auctions);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
