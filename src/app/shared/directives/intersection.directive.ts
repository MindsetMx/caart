import { Directive, ElementRef, EventEmitter, Output, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[intersection]',
  standalone: true
})
export class IntersectionDirective implements OnInit, OnDestroy {
  @Output() visible: EventEmitter<boolean> = new EventEmitter<boolean>();

  #intersectionObserver?: IntersectionObserver;
  #lastEmitTime: number = 0;

  #elementRef = inject(ElementRef);

  ngOnInit() {
    const options = {
      threshold: 0 // Umbral de intersección (0.5 significa que al menos la mitad del elemento debe estar visible)
    };

    this.#intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );

    this.#intersectionObserver.observe(this.#elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.#intersectionObserver?.disconnect();
  }

  private handleIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    const now = Date.now();
    entries.forEach(entry => {
      if (entry.isIntersecting && now - this.#lastEmitTime > 300) {
        this.emitVisible(true);
        this.#lastEmitTime = now;
      }
    });
  }

  private emitVisible(value: boolean) {
    this.visible.emit(value);
  }
}
