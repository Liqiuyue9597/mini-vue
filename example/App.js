import { h } from "../lib/guide-mini-vue.esm.js";

export const App = {
  render() {
    return h("div", { id: 'hello', class: 'mini-vue' }, [h('p',{class: 'pp'}, 'hello world')]);
  },
  setup() {
    return {
      msg: "runtime-core",
    };
  },
};
