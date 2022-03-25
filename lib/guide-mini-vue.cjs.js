'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createComponentInstance(vnode) {
    const component = {
        vnode,
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.vnode.type;
    const { setup } = component;
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

function render(vnode, container) {
    // patch
    patch(vnode);
}
function patch(vnode, container) {
    // processElement(vnode, container);
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
