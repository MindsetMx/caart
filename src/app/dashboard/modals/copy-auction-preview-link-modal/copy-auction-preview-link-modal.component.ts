import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'copy-auction-preview-link-modal',
  standalone: true,
  imports: [
    ModalComponent,
  ],
  templateUrl: './copy-auction-preview-link-modal.component.html',
  styleUrl: './copy-auction-preview-link-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyAuctionPreviewLinkModalComponent {
  isOpen = model.required<boolean>();
  auctionPreviewLink = input.required<string>();

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.auctionPreviewLink());
  }
}
