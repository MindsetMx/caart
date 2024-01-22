import { Directive, ElementRef, Renderer2, inject, Input } from '@angular/core';

@Directive({
  selector: '[sharedInput]',
  standalone: true,
})
export class InputDirective {
  @Input() rounded: string = 'rounded-lg';

  #element = inject(ElementRef<HTMLElement>);
  #renderer2 = inject(Renderer2);

  defaultClasses?: string;

  ngOnInit(): void {
    this.defaultClasses = `block w-full ${this.rounded} bg-gray1 py-3 px-4 placeholder:text-gray4 focus:ring-1 focus:ring-inset focus:ring-black focus:outline-none sm:text-sm sm:leading-6`;

    const classes = this.#element.nativeElement.getAttribute('class');

    this.#renderer2.setAttribute(this.#element.nativeElement, 'class', (classes) ? this.defaultClasses.concat(' ', classes) : this.defaultClasses);
  }
}
