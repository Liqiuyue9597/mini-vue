import { extend } from "../shared";

let activeEffect; //当前的effect函数
let shouldTrack;

export function isTracking() {
  return activeEffect !== undefined && shouldTrack;
}
export class ReactiveEffect {
  private _fn: any; // effect里的依赖函数
  deps = []; // 当前ReactiveEffect实例被存入的dep合集
  active = true; // 有没有被stop住，被stop住就不是active的状态了
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    // stop住的时候直接返回值
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const res = this._fn();

    shouldTrack = false;
    return res;
  }
  stop() {
    if (this.active) {
      cleanEffect(this);
      this.active = false;
      if (this.onStop) {
        this.onStop();
      }
    }
  }
}

function cleanEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

let targetMap = new WeakMap(); // targetMap用来存储effect函数里不同的对象
export function track(target, key) {
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key); // depsMap用来存储effect函数里同一个对象的不同属性
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
}

export function trackEffects(dep) {
  dep.add(activeEffect); // dep用来存储effect函数(ReactiveEffect实例)
  activeEffect.deps.push(dep); // 存储当前effect实例被存入的所有dep合集
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  triggerEffects(dep);
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
