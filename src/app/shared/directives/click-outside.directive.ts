import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sharedClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside: EventEmitter<void> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
