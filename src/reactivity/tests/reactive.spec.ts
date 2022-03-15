import { isProxy, isReactive, reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const origin = { foo: 1 };
    const observed = reactive(origin);
    const observed1 = reactive(origin);

    expect(origin).not.toBe(observed);
    expect(observed.foo).toBe(1);
    expect(observed).not.toBe(observed1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(origin)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  });

  it("isReactive && nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      arr: [{ bar: 2 }],
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.arr)).toBe(true);
    expect(isReactive(observed.arr[0])).toBe(true);
  });
});
