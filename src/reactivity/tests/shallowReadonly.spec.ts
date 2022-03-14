import { isReadonly, shallowReadonly } from "../reactive";

describe("happy path", () => {
  it("shallowReadonly", () => {
    const props = shallowReadonly({ bar: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.bar)).toBe(false);
  });
});
