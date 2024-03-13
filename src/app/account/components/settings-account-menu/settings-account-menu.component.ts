import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccountService } from '@app/account/services/account.service';

@Component({
  selector: 'settings-account-menu',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './settings-account-menu.component.html',
  styleUrl: './settings-account-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountMenuComponent {
  #accountService = inject(AccountService);

  get indexCurrentOption(): number {
    return this.#accountService.indexCurrentOption();
  }

  isCurrentOption(step: number) {
    return this.indexCurrentOption === step;
  }

  changeOption(step: number) {
    this.#accountService.changeStep(step);

    window.scrollTo(0, 0);
  }
}
