import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[sharedSecondaryButton]',
  standalone: true,
})
export class SecondaryButtonDirective {
  @Input() px: string = 'px-8';
  @Input() py: string = 'py-2';

  private element = inject(ElementRef<HTMLElement>);
  private renderer2 = inject(Renderer2);

  defaultClasses?: string;

  ngOnInit(): void {
    this.defaultClasses = `border rounded-lg ${this.px} ${this.py} font-optima font-semibold`;

    const classes = this.element.nativeElement.getAttribute('class');

    this.renderer2.setAttribute(this.element.nativeElement, 'class', (classes) ? this.defaultClasses.concat(' ', classes) : this.defaultClasses);
  }
}
