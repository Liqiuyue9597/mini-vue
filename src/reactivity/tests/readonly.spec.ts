import { isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(isReadonly(original.bar)).toBe(false);
    expect(isReadonly(wrapped.bar)).toBe(true);
  });

  it("warn when setting readonly value", () => {
    console.warn = jest.fn();

    let original = readonly({ foo: 1 });
    original.foo = 2;
    expect(console.warn).toBeCalled();
  });
});
