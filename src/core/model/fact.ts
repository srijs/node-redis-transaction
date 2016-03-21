export class Fact<T> {
  private _value: T;
  private _loaded = false;

  constructor(private _load: () => Promise<T>) {}

  async get() {
    if (!this._loaded) {
      this._value = await this._load();
      this._loaded = true;
    }
    return this._value;
  }

  set(value: T) {
    this._value = value;
    this._loaded = true;
  }
}
