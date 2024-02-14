import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { ClickOutsideDirective, InputDirective } from '@shared/directives';

@Component({
  selector: 'year-range',
  standalone: true,
  imports: [
    DropdownComponent,
    ClickOutsideDirective,
    InputDirective,
    FormsModule
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

  yearFrom = signal<number | undefined>(undefined);
  yearTo = signal<number | undefined>(undefined);
  #onChange: (value: { yearFrom: number | undefined, yearTo: number | undefined }) => void = () => { };
  #onTouched: () => void = () => { };

  updateYearFromInput(value: number): void {
    this.yearFrom.set(value);
    this.emitChanges();
  }

  updateYearToInput(value: number): void {
    this.yearTo.set(value);
    this.emitChanges();
  }

  private emitChanges(): void {
    // this.#onChange({ yearFrom: this.yearFrom(), yearTo: this.yearTo() });
    // if (this.yearFrom() && this.yearTo()) {
    this.#onChange({ yearFrom: this.yearFrom(), yearTo: this.yearTo() });
    // }
  }

  markAsTouched(): void {
    this.#onTouched();
  }

  writeValue(obj: { yearFrom: number, yearTo: number }): void {
    if (obj) {
      // if (obj && obj.yearFrom && obj.yearTo) {
      this.yearFrom.set(obj.yearFrom);
      this.yearTo.set(obj.yearTo);
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
