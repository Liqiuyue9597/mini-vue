// assign会改变原来的对象，也会返回一个新的对象
const isObject = (value) => value !== null && typeof value === "object";

function createComponentInstance(vnode) {
    const component = {
        vnode,
        setupState: {},
        render: null,
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
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const { setupState } = instance;
            if (Reflect.has(setupState, key)) {
                return setupState[key];
            }
        },
    });
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
    patch(vnode, container);
}
function patch(vnode, container) {
    if (typeof vnode.type === 'string') {
        // 文本节点
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
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
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    const dom = document.createElement(type);
    if (typeof children === 'string') {
        dom.textContent = children;
    }
    else if (isObject(children)) {
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
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
