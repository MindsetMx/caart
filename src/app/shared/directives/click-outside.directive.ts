import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sharedClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(null);
    }
  }
}
