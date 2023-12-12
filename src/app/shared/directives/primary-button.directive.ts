import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[sharedPrimaryButton]',
  standalone: true,
})
export class PrimaryButtonDirective {
  private element = inject(ElementRef<HTMLElement>);
  private renderer2 = inject(Renderer2);

  defaultClasses?: string;

  ngOnInit(): void {
    this.defaultClasses = `bg-black text-white rounded-lg w-full py-3.5`;

    const classes = this.element.nativeElement.getAttribute('class');

    this.renderer2.setAttribute(this.element.nativeElement, 'class', (classes) ? this.defaultClasses.concat(' ', classes) : this.defaultClasses);
  }
}
