import { reactive } from "../reactive";
import { effect } from "../effect";
import { track } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;

    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("return runner when call effect", () => {
    // effect(fn) -> 会return fn的执行结果
    let foo = 10;
    const fn = effect(() => {
      foo++;
      return "runner";
    });
    expect(foo).toBe(11);
    const runner = fn();
    expect(foo).toBe(12);
    expect(runner).toBe("runner");
  });

  it("scheduler", () => {
    let dummy;
    let run: any;
    // jest 函数mock用法学习
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
});
