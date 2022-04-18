import { componentPublicHandler, PublicInstanceProxyHandler } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    setupState: {},
    render: null,
  };

  return component;
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const component = instance.vnode.type;
  const { setup } = component;

  instance.proxy = new Proxy(
    { _: instance },
    PublicInstanceProxyHandler
  );

  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
    finishComponentSetup(instance);
  }
}

function finishComponentSetup(instance) {
  const component = instance.vnode.type;

  if (component.render) {
    instance.render = component.render;
  }
}
