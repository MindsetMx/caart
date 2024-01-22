import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, effect, inject, signal } from '@angular/core';
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

  #auctionService = inject(AuctionService);
  #authService = inject(AuthService);
  #generalInfoService = inject(GeneralInfoService);

  auctionCarPublishes: WritableSignal<AuctionCarPublicationsData[]> = signal([]);
  completeRegisterModalIsOpen: WritableSignal<boolean> = signal(false);
  hasGeneralInfo$: Observable<boolean> | undefined;

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
    this.getHasGeneralInfo();
  }

  getAuctionCarPublishes(): void {
    this.#auctionService.auctionCarPublications$().subscribe((auctionCarPublishes) => {
      this.auctionCarPublishes.set(auctionCarPublishes.data);
    });
  }

  openCompleteRegisterModal(): void {
    this.completeRegisterModalIsOpen.set(true);
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
