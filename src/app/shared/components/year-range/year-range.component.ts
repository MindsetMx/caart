import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { ClickOutsideDirective, InputDirective } from '@shared/directives';

@Component({
  selector: 'year-range',
  standalone: true,
  imports: [
    DropdownComponent,
    ClickOutsideDirective,
    InputDirective
  ],
  templateUrl: './year-range.component.html',
  styleUrl: './year-range.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: YearRangeComponent,
      multi: true
    }
  ]
})
export class YearRangeComponent implements ControlValueAccessor {
  @Input() isOpen = signal<boolean>(false);
  #disabled: boolean = false;

  @Input() set disabled(value: any) {
    this.#disabled = value !== null && `${value}` !== 'false';
  }

  get disabled(): boolean {
    return this.#disabled;
  }

  since = signal<number>(0);
  until = signal<number>(0);
  #onChange: (value: { since: number, until: number }) => void = () => { };
  #onTouched: () => void = () => { };

  updateSinceInput(value: Event): void {
    this.since.set(Number((value.target as HTMLInputElement).value));
    this.emitChanges();
  }

  updateUntilInput(value: Event): void {
    this.until.set(Number((value.target as HTMLInputElement).value));
    this.emitChanges();
  }

  private emitChanges(): void {
    this.#onChange({ since: this.since(), until: this.until() });
  }

  markAsTouched(): void {
    this.#onTouched();
  }

  writeValue(obj: { since: number, until: number }): void {
    if (obj) {
      this.since.set(obj.since);
      this.until.set(obj.until);
    }
  }

  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }
}
