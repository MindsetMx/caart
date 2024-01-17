import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[sharedClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter();

  private destroy$ = new Subject<void>();
  private isFirstOpen = true;

  constructor(private elRef: ElementRef) {
    fromEvent(document, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        if (!this.isFirstOpen && !this.elRef.nativeElement.contains(event.target)) {
          this.clickOutside.emit();
        }
        this.isFirstOpen = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
