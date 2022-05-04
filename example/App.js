import { h } from '../lib/guide-mini-vue.esm.js';

window.self = null;
export const App = {
  render() {
    window.self = this;
    // return h('div', { id: 'hello', class: 'mini-vue' },
    // [
    //   h('p', { class: 'pp' }, 'hello world'),
    // ]);
    return h('div', 
    { 
      id: 'hello', 
      class: 'mini-vue' ,
      onClick() {
        console.log('click');
      }
    }, 
    'hi ' + this.msg);
  },
  setup() {
    return {
      msg: 'runtime-core',
    };
  },
};
