import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    const a = reactive({
      foo: 1,
    });
    const foo = computed(() => a.foo);

    expect(foo.value).toBe(1);
  });

  it("computed properties", () => {
    const a = reactive({
      foo: 1,
    });
    const fn = jest.fn(() => a.foo);
    const foo = computed(fn);

    // lazy load
    expect(fn).not.toBeCalled();
    expect(foo.value).toBe(1);
    expect(fn).toBeCalledTimes(1);

    // cache value
    foo.value;
    expect(fn).toBeCalledTimes(1);

    // should not computed until needed
    a.foo = 2; // 不使用effect会导致track不上
    expect(fn).toBeCalledTimes(1);
    
    // computed again
    expect(foo.value).toBe(2);
    expect(fn).toBeCalledTimes(2);
  });
});
