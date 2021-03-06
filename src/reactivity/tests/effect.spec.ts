import { reactive } from "../reactive";
import { effect, stop } from "../effect";

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

  // scheduler类似于回调函数（lazy load），等到effect里函数执行之后再执行
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

  // 单测的行为：1.写测试 2.让测试通过 3.重构
  it("stop", () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    });
    obj.foo = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.foo = 3;
    obj.foo++; // obj.foo = obj.foo + 1
    expect(dummy).toBe(2);

    // 函数在stop后手动call一次就把stop函数的作用移除了
    runner();
    expect(dummy).toBe(3);
  });

  // 调用stop的回调函数
  it("onStop", () => {
    let dummy;
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1); // toHaveBeenCalledTimes的别名
  });
});
