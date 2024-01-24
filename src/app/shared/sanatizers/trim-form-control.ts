import { FormControl } from '@angular/forms';

export class TrimFormControl extends FormControl {
  private _trimmedValue!: string | null;
  get trimmedValue() {
    return this._trimmedValue;
  }
  set trimmedValue(value: string | null) {
    this.trimmedValue = value ? value.trim() : value;
  }
}
