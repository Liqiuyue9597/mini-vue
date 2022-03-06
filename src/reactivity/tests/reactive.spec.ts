import { reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const origin = { foo: 1 };
    const observed = reactive(origin);
    const observed1 = reactive(origin);

    expect(origin).not.toBe(observed);
    expect(observed.foo).toBe(1);
    expect(observed).not.toBe(observed1);
  });
});
