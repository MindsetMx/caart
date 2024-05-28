import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

import { AppComponent } from '@app/app.component';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuctionTypes } from '@auctions/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CountdownService } from '@shared/services/countdown.service';
import { LastChanceAuctionVehicleDetail } from '@app/last-chance/interfaces';
import { PrimaryButtonDirective } from '@shared/directives';
import { SpecificAuction } from '@auctions/interfaces';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { NoReserveTagComponentComponent } from '@auctions/components/no-reserve-tag-component/no-reserve-tag-component.component';

@Component({
  selector: 'last-chance-sticky-info-bar',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    StarComponent,
    PrimaryButtonDirective,
    NoReserveTagComponentComponent
  ],
  templateUrl: './last-chance-sticky-info-bar.component.html',
  styleUrl: './last-chance-sticky-info-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceStickyInfoBarComponent {
  auction = input.required<LastChanceAuctionVehicleDetail>();
  specificAuction = input.required<SpecificAuction>();
  isFollowing = model.required<boolean>();
  openMakeAnOfferModalChange = output<void>();
  openBuyNowModalChange = output<void>();
  getMetricsChange = output<string>();

  #countdownService = inject(CountdownService);
  #authService = inject(AuthService);
  #auctionFollowService = inject(AuctionFollowService);
  #appComponent = inject(AppComponent);

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  followOrUnfollowAuction(auctionId: string): void {
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    if (this.isFollowing()) {
      this.unfollowAuction(auctionId);
    } else {
      this.followAuction(auctionId);
    }
  }

  followAuction(auctionId: string): void {
    this.#auctionFollowService.followAuction$(auctionId, AuctionTypes.car).subscribe({
      next: (response) => {
        this.getMetrics(auctionId);
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  unfollowAuction(auctionId: string): void {
    this.#auctionFollowService.unfollowAuction$(auctionId, AuctionTypes.car).subscribe({
      next: (response) => {
        this.getMetrics(auctionId);
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getMetrics(auctionId: string): void {
    this.getMetricsChange.emit(auctionId);
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  countdownConfig(): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);

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

  openMakeAnOfferModal(): void {
    this.openMakeAnOfferModalChange.emit();
  }

  openBuyNowModal(): void {
    this.openBuyNowModalChange.emit();
  }
}
