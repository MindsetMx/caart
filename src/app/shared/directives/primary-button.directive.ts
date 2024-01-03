import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[sharedPrimaryButton]',
  standalone: true,
})
export class PrimaryButtonDirective {
  @Input() px: string = 'px-8';
  @Input() py: string = 'py-3.5';
  @Input() rounded: string = 'rounded-lg';
  @Input() classes: string = 'font-lato';
  @Input() width: string = 'w-full';

  #element = inject(ElementRef<HTMLElement>);
  #renderer2 = inject(Renderer2);

  defaultClasses?: string;

  ngOnInit(): void {
    this.defaultClasses = `bg-black text-white ${this.rounded} ${this.width} ${this.px} ${this.py} ${this.classes}`;

    const classes = this.#element.nativeElement.getAttribute('class');

    this.#renderer2.setAttribute(this.#element.nativeElement, 'class', (classes) ? this.defaultClasses.concat(' ', classes) : this.defaultClasses);
  }
}
