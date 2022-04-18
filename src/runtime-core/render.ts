import { isObject } from '../shared/index';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  if (typeof vnode.type === 'string') {
    // 文本节点
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  // 真正的element都mount成功才能拿到el
  vnode.el = subTree.el;
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode;
  const dom = document.createElement(type);
  vnode.el = dom;

  if (typeof children === 'string') {
    dom.textContent = children;
  } else if (isObject(children)) {
    mountChildren(vnode, dom);
  }

  for (const key in props) {
    const value = props[key];
    dom.setAttribute(key, value);
  }

  container.appendChild(dom);
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container);
  });
}
