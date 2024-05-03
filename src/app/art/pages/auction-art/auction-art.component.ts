import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Carousel, Fancybox } from "@fancyapps/ui";

import { CountdownService } from '@shared/services/countdown.service';
import { CommonModule } from '@angular/common';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { AuctionTypes, AuctionTypesComments } from '@auctions/enums';
import { CommentsTextareaComponent } from '@auctions/components/comments-textarea/comments-textarea.component';
import { PrimaryButtonDirective } from '@shared/directives';
// import { Thumbs } from '@fancyapps/ui/types/Carousel/plugins/Thumbs/Thumbs';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    StarComponent,
    CommentsTextareaComponent,
    PrimaryButtonDirective
  ],
  templateUrl: './auction-art.component.html',
  styleUrl: './auction-art.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtComponent implements AfterViewInit {
  #countdownService = inject(CountdownService);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get auctionTypesComments(): typeof AuctionTypesComments {
    return AuctionTypesComments;
  }

  ngAfterViewInit(): void {
    new Carousel(
      document.getElementById('myCarousel'),
      {
        // Custom Carousel options
        Dots: false,
      },
      {
        Thumbs,
      }
    );

    Fancybox.bind('[data-fancybox="gallery"]', {
      // Custom Fancybox options
    });
  }

  getComments(): void {
  }

  countdownConfig(): CountdownConfig {
    // let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
    let leftTime = 10000;
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

  followOrUnfollowAuction(): void {

  }

  openMakeAnOfferModal(): void {
  }
}
