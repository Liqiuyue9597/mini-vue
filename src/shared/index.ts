// assign会改变原来的对象，也会返回一个新的对象
export const extend = Object.assign;
export const isObject = (value) => value !== null && typeof value === "object";
