import { effect } from "../effect";
import { ref } from "../ref";

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
});
