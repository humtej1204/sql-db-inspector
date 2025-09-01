export abstract class StringValueObject {
  constructor(private _value: string) {}

  get value(): string {
    return String(this._value);
  }

  set value(value: string | number) {
    this._value = String(value);
  }
}
