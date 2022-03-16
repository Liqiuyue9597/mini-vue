import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRef, ref, unRef } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let count = 0;
    let dummy;
    effect(() => {
      count++;
      dummy = a.value;
    });

    expect(count).toBe(1);
    a.value = 2;
    expect(dummy).toBe(2);
    expect(count).toBe(2);
    // bad case
    a.value = 2;
    expect(count).toBe(2);
    expect(dummy).toBe(2);
  });

  it("nested properties should be reactive", () => {
    const obj = ref({
      a: 1,
    });
    let dummy;
    effect(() => {
      dummy = obj.value.a;
    });

    expect(dummy).toBe(1);
    obj.value.a = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const r = reactive({ foo: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(r)).toBe(false);
    expect(isRef(1)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it('proxyRef', () => {
    const user = {
      age: ref(10),
      name: 'haha',
    }
    const proxyUser = proxyRef(user);

    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe('haha');

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);
    
    proxyUser.age = ref(30);
    expect(user.age.value).toBe(30);
    expect(proxyUser.age).toBe(30);
  });
});
