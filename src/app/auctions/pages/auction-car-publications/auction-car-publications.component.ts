import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { RouterLink } from '@angular/router';

import { AuctionCarPublicationsData } from '@app/auctions/interfaces/auction-car-publishes';
import { AuctionService } from '@app/auctions/services/auction.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
import { environments } from '@env/environments';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { UserData } from '@auth/interfaces';
import { AuctionMemorabiliaService } from '@auctions/services/auction-memorabilia.service';
import { AuctionMemorabiliaPublications } from '@auctions/interfaces';

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    CompleteRegisterModalComponent,
    RouterLink,
  ],
  templateUrl: './auction-car-publications.component.html',
  styleUrl: './auction-car-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarPublishesComponent implements OnInit {
  readonly baseUrl = environments.baseUrl;

  #auctionMemorabiliaService = inject(AuctionMemorabiliaService);
  #auctionService = inject(AuctionService);
  #authService = inject(AuthService);
  #generalInfoService = inject(GeneralInfoService);

  auctionCarPublishes = signal<AuctionCarPublicationsData[]>([]);
  auctionMemorabiliaPublishes = signal<AuctionMemorabiliaPublications>({} as AuctionMemorabiliaPublications);
  completeRegisterModalIsOpen = signal<boolean>(false);
  hasGeneralInfo$: Observable<boolean> | undefined;
  publicationId = signal<string>('');

  authStatusChangeEffect = effect(() => {
    if (this.authStatus === AuthStatus.authenticated) {
      this.getHasGeneralInfo();
    }
  });

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get userIsNotAuthenticated(): boolean {
    return this.authStatus === AuthStatus.notAuthenticated;
  }

  ngOnInit(): void {
    this.getAuctionCarPublishes();
    this.getAuctionMemorabilia();
    this.getHasGeneralInfo();
  }

  getAuctionCarPublishes(): void {
    this.#auctionService.auctionCarPublications$().subscribe((auctionCarPublishes) => {
      this.auctionCarPublishes.set(auctionCarPublishes.data);
    });
  }

  getAuctionMemorabilia(): void {
    this.#auctionMemorabiliaService.getMemorabiliaPublications$().subscribe((auctionMemorabilia) => {
      this.auctionMemorabiliaPublishes.set(auctionMemorabilia);
    });
  }

  openCompleteRegisterModal(publicationId: string): void {
    this.completeRegisterModalIsOpen.set(true);
    this.publicationId.set(publicationId);
  }

  getHasGeneralInfo(): void {
    this.hasGeneralInfo$ = this.#generalInfoService.getGeneralInfo$().pipe(
      map(response => {
        return response.data.attributes.hasGeneralInfo;
      }),
      catchError((error) => {
        console.error(error);

        return EMPTY;
      })
    );
  }
}
