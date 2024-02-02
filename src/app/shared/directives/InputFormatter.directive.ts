import { AfterContentChecked, Directive, ElementRef, HostListener, NgZone, Renderer2, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgControl } from '@angular/forms';

const NUMBER_REGEX = /^\d+(\.\d{0,2})?$/; // Solo números con hasta dos decimales
const ALLOWED_KEYS = ['Backspace', 'Delete', 'ArrowUp', 'ArrowDown', '-', '.', 'Control', 'Alt', 'Meta', 'Home', 'End', 'PageUp', 'PageDown', 'ArrowLeft', 'ArrowRight', 'Insert', 'Tab'];

@Directive({
  selector: '[inputFormatter]',
  standalone: true,
})
export class InputFormatterDirective implements AfterContentChecked {
  #renderer = inject(Renderer2);
  #ngZone = inject(NgZone);
  #ngControl = inject(NgControl);
  #elementRef = inject(ElementRef);
  private hasFormatted = false;

  ngAfterContentChecked(): void {
    if (!this.hasFormatted) {
      let value = this.#ngControl.control?.value;
      if (value) {
        value = this.formatValue(value);
        this.#ngControl.control?.setValue(value, { emitEvent: false });
        this.#renderer.setProperty(this.#elementRef.nativeElement, 'value', value);
        this.hasFormatted = true;
      }
    }
  }

  formatValue(value: string): string {
    value = this.removeCommas(value);

    if (value === '' || !NUMBER_REGEX.test(value)) return '';

    return this.formatBasedOnEnding(value);
  }

  removeCommas(value: string): string {
    return String(value).replace(/,/g, ''); // Eliminar comas
  }

  formatBasedOnEnding(value: string): string {
    const integerPart = value.split('.')[0];
    const formattedInteger = new DecimalPipe('en-US').transform(integerPart, '1.0-0') || '';

    if (value.endsWith('.')) {
      return formattedInteger + '.';
    } else if (value.endsWith('.0')) {
      return formattedInteger + '.0';
    } else {
      return new DecimalPipe('en-US').transform(value, '1.0-2') || '';
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    let value = this.removeCommas((event.target as HTMLInputElement).value);

    if (value === '' || !NUMBER_REGEX.test(value)) return;

    this.#ngZone.run(() => {
      this.#ngControl.control?.setValue(value, { emitEvent: false });
    });

    this.#renderer.setProperty(this.#elementRef.nativeElement, 'value', this.formatBasedOnEnding(value));
  }

  @HostListener('keypress', ['$event'])
  validateInput(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: string = inputElement.value;
    const decimalPart = inputValue.split('.')[1];

    if (this.isInvalidKey(event, decimalPart, inputValue, inputElement)) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: string = inputElement.value;

    this.incrementOrDecrementValue(event, inputValue, inputElement);
  }

  isInvalidKey(event: KeyboardEvent, decimalPart: string, inputValue: string, inputElement: HTMLInputElement): boolean {
    return (decimalPart && decimalPart.length >= 2 && event.key !== 'Backspace' && event.key !== 'Delete') ||
      (inputValue.includes('.') && event.key === '.') ||
      (event.key === '-' && inputElement.selectionStart !== 0) ||
      (event.key === '.' && inputElement.selectionStart === 0) ||
      (isNaN(Number(event.key)) && !ALLOWED_KEYS.includes(event.key) && !(event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())));
  }

  incrementOrDecrementValue(event: KeyboardEvent, inputValue: string, inputElement: HTMLInputElement): void {
    const valueWithoutCommas = this.removeCommas(inputValue);
    const value = valueWithoutCommas === '' || valueWithoutCommas === '-' ? 0 : parseFloat(valueWithoutCommas);
    let newValue: number | undefined = undefined;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      newValue = value + 1;
      this.#ngControl.control?.setValue(newValue?.toString(), { emitEvent: false });
      this.#renderer.setProperty(this.#elementRef.nativeElement, 'value', this.formatBasedOnEnding(newValue?.toString() || ''));
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      newValue = value - 1;
      this.#ngControl.control?.setValue(newValue?.toString(), { emitEvent: false });
      this.#renderer.setProperty(this.#elementRef.nativeElement, 'value', this.formatBasedOnEnding(newValue?.toString() || ''));
    }
  }

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent): void {
    if (event.clipboardData) {
      const pastedInput: string = event.clipboardData.getData('text/plain');
      let pastedNumber = parseFloat(pastedInput);

      // Si el valor pegado no es un número, cancelar el evento
      if (isNaN(pastedNumber)) {
        event.preventDefault();
      }
    }
  }
}
