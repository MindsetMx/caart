import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  expandedGeneralQuestions = signal<boolean[]>([]);
  expandedBuyerQuestions = signal<boolean[]>([]);
  expandedSellerQuestions = signal<boolean[]>([]);

  toggleAnswer(index: number, expandedArray: WritableSignal<boolean[]>) {
    // expandedArray[index] = !expandedArray[index];
    expandedArray.update((arr) => {
      arr[index] = !arr[index];
      return arr;
    });
  }
}
