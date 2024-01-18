import { Directive, ElementRef, HostListener, Output, EventEmitter, inject } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[sharedClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter();

  #elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.#elementRef.nativeElement.contains(event.target)) {
      this.clickOutside.emit();
    }
  }
}
