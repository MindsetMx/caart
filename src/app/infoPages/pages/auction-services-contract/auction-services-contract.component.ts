import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './auction-services-contract.component.html',
  styleUrl: './auction-services-contract.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionServicesContractComponent { }
