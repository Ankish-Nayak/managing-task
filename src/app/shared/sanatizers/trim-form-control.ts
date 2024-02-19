import { FormControl } from '@angular/forms';

export class TrimFormControl extends FormControl {
  private _trimmedValue!: string | null;
  public get trimmedValue() {
    return this._trimmedValue;
  }
  public set trimmedValue(value: string | null) {
    this.trimmedValue = value ? value.trim() : value;
  }
}
