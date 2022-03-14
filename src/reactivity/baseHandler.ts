import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();

function createGetter(isReadonly = false, shallow = false) {
  return function (target, key) {
    if (key === ReactiveFlags.isReactive) {
      return !isReadonly;
    } else if (key === ReactiveFlags.isReadonly) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (shallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);

    trigger(target, key);
    return res;
  };
}

export const mutualHandler = {
  get,
  set,
};

export const readonlyHandler = {
  get: readonlyGet,
  set() {
    console.warn(`readonly`);
    return true;
  },
};

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGet
})
