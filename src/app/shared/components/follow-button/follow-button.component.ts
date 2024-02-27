import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AuctionMetrics } from '@auctions/interfaces';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuctionFollowService } from '@auctions/services/auction-follow.service';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { StarComponent } from '../icons/star/star.component';

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
    this.getMetrics();
  }

  followAuction(): void {
    this.#auctionFollowService.followAuction$(this.auctionId()).subscribe({
      next: (response) => {
        this.getMetrics();
        this.isFollowing.set(response.data.attributes.isFollowing);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  unfollowAuction(): void {
    this.#auctionFollowService.unfollowAuction$(this.auctionId()).subscribe({
      next: (response) => {
        this.getMetrics();
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
}
