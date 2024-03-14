import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';

import { AccountService } from '@app/account/services/account.service';
import { SettingsAccountMenuComponent } from '@account/components/settings-account-menu/settings-account-menu.component';
import { SettingsAccountPasswordComponent } from '@app/account/components/settings-account-password/settings-account-password.component';
import { SettingsAccountPaymentMethodsComponent } from '@app/account/components/settings-account-payment-methods/settings-account-payment-methods.component';
import { SettingsAccountPersonalDataComponent } from '@app/account/components/settings-account-personal-data/settings-account-personal-data.component';

@Component({
  selector: 'account-settings',
  standalone: true,
  imports: [
    SettingsAccountMenuComponent,
    SettingsAccountPersonalDataComponent,
    SettingsAccountPasswordComponent,
    SettingsAccountPaymentMethodsComponent,
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent {
  #accountService = inject(AccountService);

  get indexCurrentOption(): WritableSignal<number> {
    return this.#accountService.indexCurrentOption;
  }
}
