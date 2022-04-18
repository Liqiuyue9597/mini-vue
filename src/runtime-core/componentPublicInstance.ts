const PublicPropertiesMap = {
  "$el": (i) => i.vnode.el
}

export const PublicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (Reflect.has(setupState, key)) {
      return setupState[key];
    }
    const publicGetter = PublicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}