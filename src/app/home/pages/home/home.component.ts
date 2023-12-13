import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    SecondaryButtonDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;

  ngAfterViewInit(): void {
    const swiperEl = this.carousel.nativeElement;
    console.log({ swiperEl });

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
    };

    // now we need to assign all parameters to Swiper element
    Object.assign(swiperEl, swiperParams);

    // and now initialize it
    swiperEl.initialize();
  }
}
