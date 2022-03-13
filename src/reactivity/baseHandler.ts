import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);
const set = createSetter();

function createGetter(isReadonly = false) {
  return function (target, key) {
    const res = Reflect.get(target, key);
    if (key === ReactiveFlags.isReactive) {
      return !isReadonly;
    } else if (key === ReactiveFlags.isReadonly) {
      return isReadonly;
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
