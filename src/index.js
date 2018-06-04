import JsonEditor from './JsonEditor.vue'
import JsonView from './JsonView.vue'
import ArrayView from './ArrayView.vue'
import PackageFile from '../package.json'
import Popover from 'vue-js-popover'

const VERSION = PackageFile.version;

const install = (Vue) => {
  if (install.installed) return;

  Vue.use(Popover);

  Vue.component('JsonEditor', JsonEditor);
  Vue.component('json-view', JsonView);
  Vue.component('array-view', ArrayView);


  Array.prototype.rmIndex = function (index) {
	  this.splice(index, 1);
	  return this
	};

	Array.prototype.rmItem = function (item) {
    const i = this.indexOf(item);
    if (i !== -1) {
      this.rmIndex(i)
    }
    return this
  }
};

export default install

export const components = {
  JsonEditor,
  Popover,
  VERSION
};

