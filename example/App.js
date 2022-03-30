import { h } from '../lib/guide-mini-vue.esm.js';

export const App = {
  render() {
    // return h('div', { id: 'hello', class: 'mini-vue' },
    // [
    //   h('p', { class: 'pp' }, 'hello world'),
    // ]);
    return h('div', { id: 'hello', class: 'mini-vue' }, 'hi ' + this.msg);
  },
  setup() {
    return {
      msg: 'runtime-core',
    };
  },
};
