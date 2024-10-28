import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'car-auction-video-assignment-and-reorder',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './car-auction-video-assignment-and-reorder.component.html',
  styleUrl: './car-auction-video-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarAuctionVideoAssignmentAndReorderComponent {
  items = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
