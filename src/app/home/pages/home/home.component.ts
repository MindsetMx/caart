import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    SecondaryButtonDirective,
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;

  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < 768; // Actualiza el valor en tiempo real
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
}
