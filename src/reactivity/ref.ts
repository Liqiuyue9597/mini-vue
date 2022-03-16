import { isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

class RefImpl {
  private _value: any;
  private _rawValue: any;
  private __v_isRef = true;
  dep: Set<unknown>;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newValue) {
    if (this._rawValue === newValue) return;

    this._value = convert(newValue);
    this._rawValue = newValue;

    triggerEffects(this.dep);
  }
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRef(obj) {
  return new Proxy(obj, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (!isRef(value) && isRef(target[key])) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
