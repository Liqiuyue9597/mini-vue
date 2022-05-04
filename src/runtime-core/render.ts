import { isObject, isOn } from '../shared/index';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // patch
  patch(vnode, container);
}

function patch(vnode, container) {
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // 文本节点
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode);

  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance;

  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  // 真正的element都mount成功才能拿到el
  initialVnode.el = subTree.el;
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, props, children, shapeFlag } = vnode;
  const dom = document.createElement(type);
  vnode.el = dom;

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    dom.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, dom);
  }

  for (const key in props) {
    const value = props[key];
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      dom.addEventListener(event, value);
    } else {
      dom.setAttribute(key, value);
    }
  }

  container.appendChild(dom);
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container);
  });
}
