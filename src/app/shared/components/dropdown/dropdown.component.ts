import { Component, Input, WritableSignal, input, signal } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'shared-dropdown',
  standalone: true,

  animations: [
    trigger('fadeAndScale', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('0.1s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.075s ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
  isOpen = input.required<boolean>();
  width = input<string>('w-48');
}
