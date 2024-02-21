import { ChangeDetectionStrategy, Component, Input, Output, signal, EventEmitter, OnInit, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'notification',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-0.5rem) translateX(0.5rem)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0) translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('100ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit {
  @Input({ required: true }) message!: string;
  @Output() notificationClosed = new EventEmitter<void>();
  isOpen = signal<boolean>(true);

  ngOnInit(): void {
    this.notificationClosed.emit();
  }

  closeNotification(): void {
    this.isOpen.set(false);
  }
}
