import component from './component';
import { PluginObject } from "vue";

type ComponentType = typeof component & PluginObject<void>;

const plugin = component as ComponentType;

plugin.install = function (Vue) {
  Vue.component("component-name", component);
};

// plugin.version = process.env.VUE_APP_VERSION!;

export default plugin;