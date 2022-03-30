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
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);
  patch(subTree, container);
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode;
  const dom = document.createElement(type);

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
