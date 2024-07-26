import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownModule } from 'ngx-countdown';
import { RouterLink } from '@angular/router';

import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { VehicleAuctionData } from '@auctions/interfaces';
import { PrimaryButtonDirective } from '@shared/directives';
import { LastChanceVehiclesData } from '@app/last-chance/interfaces';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { LastChanceBidModalComponent } from '@auctions/modals/last-chance-bid-modal/last-chance-bid-modal.component';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { AppComponent } from '@app/app.component';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { LastChanceBuyNowModalComponent } from '@auctions/modals/last-chance-buy-now-modal/last-chance-buy-now-modal.component';

@Component({
  selector: 'last-chance-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    PrimaryButtonDirective,
    LastChanceBidModalComponent,
    PaymentMethodModalComponent,
    LastChanceBuyNowModalComponent,
  ],
  templateUrl: './last-chance-vehicle-card.component.html',
  styleUrl: './last-chance-vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceVehicleCardComponent {
  // auction = input.required<LastChanceVehiclesData>();
  auctionId = input.required<string>();
  originalAuctionId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  extract = input.required<string>();
  isPremium = input.required<boolean>();

  makeAnOfferModalIsOpen = signal<boolean>(false);
  newOfferMade = signal<number>(0);
  paymentMethodId = signal<string>('');
  paymentMethodModalIsOpen = signal<boolean>(false);

  #authService = inject(AuthService);
  #appComponent = inject(AppComponent);
  #paymentMethodsService = inject(PaymentMethodsService);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  openMakeAnOfferModal($event: Event,): void {
    $event.stopPropagation();

    if (this.authStatus === AuthStatus.notAuthenticated) {
      localStorage.setItem('redirectUrl', window.location.pathname);
      this.openSignInModal();

      return;
    }

    //Si tiene un método de pago registrado, se abre el modal
    this.#paymentMethodsService.getPaymentMethods$().subscribe((paymentMethods) => {
      if (paymentMethods.data.length > 0) {
        const paymentMethod = paymentMethods.data.find((paymentMethod) => paymentMethod.attributes.isDefault);

        if (!paymentMethod) {
          throw new Error('No default payment method found');
        }

        this.paymentMethodId.set(paymentMethod.id);
        this.makeAnOfferModalIsOpen.set(true);
        return;
      }

      //Si no tiene un método de pago registrado, se abre el modal de registro de método de pago
      this.paymentMethodModalIsOpen.set(true);
    });
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }
}
