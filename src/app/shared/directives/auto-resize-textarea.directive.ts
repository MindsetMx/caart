import { Directive, ElementRef, HostListener, NgZone } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sharedAutoResizeTextarea]'
})
export class AutoResizeTextareaDirective {
  private textarea: HTMLTextAreaElement;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {
    this.textarea = this.elementRef.nativeElement;
  }

  @HostListener('input')
  onInput() {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.adjustHeight();
      });
    });
  }

  private adjustHeight() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }
}
