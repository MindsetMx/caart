import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[sharedPrimaryButton]',
  standalone: true,
})
export class PrimaryButtonDirective {
  @Input() px: string = 'px-8';
  @Input() py: string = 'py-3.5';

  #element = inject(ElementRef<HTMLElement>);
  #renderer2 = inject(Renderer2);

  defaultClasses?: string;

  ngOnInit(): void {
    this.defaultClasses = `bg-black text-white rounded-lg w-full ${this.px} ${this.py}`;

    const classes = this.#element.nativeElement.getAttribute('class');

    this.#renderer2.setAttribute(this.#element.nativeElement, 'class', (classes) ? this.defaultClasses.concat(' ', classes) : this.defaultClasses);
  }
}
