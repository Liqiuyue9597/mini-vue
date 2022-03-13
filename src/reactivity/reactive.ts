import { mutualHandler, readonlyHandler } from "./baseHandler";
export enum ReactiveFlags {
  "isReactive" = "__v_reactive",
  "isReadonly" = "__v_readonly",
}

function createActiveObj(raw, baseHandler) {
  return new Proxy(raw, baseHandler);
}

export function reactive(raw) {
  return createActiveObj(raw, mutualHandler);
}

export function readonly(raw) {
  return createActiveObj(raw, readonlyHandler);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.isReactive];
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.isReadonly];
}
