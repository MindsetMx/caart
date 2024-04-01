import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AuctionMetrics } from '@auctions/interfaces';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { StarComponent } from '../icons/star/star.component';
import { AuctionTypes } from '@auctions/enums/auction-types';

@Component({
  selector: 'follow-button',
  standalone: true,
  imports: [
    CommonModule,
    StarComponent
  ],
  templateUrl: './follow-button.component.html',
  styleUrl: './follow-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowButtonComponent implements OnInit {
  auctionId = input.required<string>();
  auctionType = input.required<AuctionTypes>();

  isFollowing = signal<boolean | undefined>(undefined);
  metrics = signal<AuctionMetrics>({} as AuctionMetrics);

  #auctionFollowService = inject(AuctionFollowService);
  #auctionDetailsService = inject(AuctionDetailsService);
  #authService = inject(AuthService);
  #appComponent = inject(AppComponent);

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  ngOnInit(): void {
    if (this.authStatus === AuthStatus.authenticated) {
      this.getAuctionMetrics();
    }
  }

  getAuctionMetrics() {
    switch (this.auctionType()) {
      case AuctionTypes.car:
        this.getMetrics();
        break;
      case AuctionTypes.memorabilia:
        this.getMemorabiliaMetrics();
        break;
    }
  }

  followAuction(): void {
    this.#auctionFollowService.followAuction$(this.auctionId(), this.auctionType()).subscribe({
      next: (response) => {
        this.getAuctionMetrics();
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  unfollowAuction(): void {
    this.#auctionFollowService.unfollowAuction$(this.auctionId(), this.auctionType()).subscribe({
      next: (response) => {
        this.getAuctionMetrics();
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  followOrUnfollowAuction($event: Event): void {
    $event.stopPropagation();
    if (this.authStatus === AuthStatus.notAuthenticated) {
      this.openSignInModal();

      return;
    }

    if (this.isFollowing()) {
      this.unfollowAuction();
    } else {
      this.followAuction();
    }
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  getMetrics(): void {
    this.#auctionDetailsService.getMetrics$(this.auctionId()).subscribe({
      next: (metrics: AuctionMetrics) => {
        this.metrics.set(metrics);
        this.isFollowing.set(metrics.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getMemorabiliaMetrics(): void {
    this.#auctionDetailsService.getMemorabiliaMetrics$(this.auctionId()).subscribe({
      next: (metrics: AuctionMetrics) => {
        this.metrics.set(metrics);
        this.isFollowing.set(metrics.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
