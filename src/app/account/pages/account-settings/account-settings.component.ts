import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';

import { AccountService } from '@app/account/services/account.service';
import { SettingsAccountMenuComponent } from '@account/components/settings-account-menu/settings-account-menu.component';
import { SettingsAccountPersonalDataComponent } from '@app/account/components/settings-account-personal-data/settings-account-personal-data.component';
import { SettingsAccountPasswordComponent } from '@app/account/components/settings-account-password/settings-account-password.component';

@Component({
  selector: 'account-settings',
  standalone: true,
  imports: [
    SettingsAccountMenuComponent,
    SettingsAccountPersonalDataComponent,
    SettingsAccountPasswordComponent
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
