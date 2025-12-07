import {FieldType} from "./field.type";

export class FilterModel {

  private _name: string;
  private _type: FieldType;
  private _value: any;

  constructor(name: string, type: FieldType, value: any) {
    this._name = name;
    this._type = type;
    this._value = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get type(): FieldType {
    return this._type;
  }

  set type(value: FieldType) {
    this._type = value;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }
}
