import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, input } from '@angular/core';
import { AuctionDetails } from '@auctions/interfaces';

@Component({
  selector: 'image-gallery',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  @Input({ required: true }) photos: string[] = [];
  index = input.required<number>();

  photoGalleryLength: number = 4;

  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < 768; // Actualiza el valor en tiempo real
  }

  incrementPhotoGalleryLength(): void {
    if (!this.isMobile) return;

    this.photoGalleryLength += 8;
  }
}
