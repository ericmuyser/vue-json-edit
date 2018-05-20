<template>
    <div class="block_content">
        <span v-for="(item, index) in flowData" :key="index"
              :class="['block', 'clearfix', {'hide-block': hideMyBlock[index] === true}]">
            <span class="json-key">
                <input
                    type="text"
                    v-model="item.name"
                    class="key-input"
                    v-if="typeof item.name === 'string'"
                    @change="keyInputBlur(item, $event)"
                >
                <i
                    class="collapse-down"
                    v-if="item.type === 'object' || item.type === 'array'"
                    @click="closeBlock(index, $event)"
                >
                    <i class="fa fa-chevron-down"></i>
                </i>
                <i
                    class="del-btn"
                    @click="delItem(parsedData, item, index)"
                >
                    <i class="fa fa-remove"></i>
                </i>

                <i v-if="item.type === 'object'" class="i-type">
                    {{'{' + item.childParams.length + '}'}}
                </i>
                <i v-if="item.type === 'array'" class="i-type">
                    {{'[' + item.childParams.length + ']'}}
                </i>

            </span>
            <span class="json-val">
                <template v-if="item.type === 'object'">
                    <json-view :parsedData="item.childParams" v-model="item.childParams"></json-view>
                </template>

                <template v-else-if="item.type === 'array'">
                    <array-view :parsedData="item.childParams" v-model="item.childParams"></array-view>
                </template>

                <template v-else>
                    <span class="val">
                        <input
                            type="text"
                            v-model="item.remark"
                            class="val-input"
                            v-if="item.type === 'string'"
                        >
                        <input
                            type="number"
                            v-model.number="item.remark"
                            class="val-input"
                            v-if="item.type === 'number'"
                        >
                        <select
                            name="value"
                            v-model="item.remark"
                            class="val-input"
                            v-if="item.type === 'boolean'"
                        >
                            <option :value="true">true</option>
                            <option :value="false">false</option>
                        </select>
                    </span>
                </template>
            </span>
        </span>

        <div class="block add-key" v-popover="{ name: popoverKey }">
            <i class="fa fa-plus"></i>
        </div>
        <popover :name="popoverKey" width="auto" :pointer="false">
            <item-add-form @confirm="newItem"></item-add-form>
        </popover>

    </div>
</template>

<script>
  import ItemAddForm from './ItemAddForm.vue'

  export default {
    name: 'JsonView',
    props: {parsedData: {}},

    data: function () {
      return {
        flowData: [],
        toAddItem: false,
        hideMyBlock: {},
        popoverKey: null,
      }
    },

    beforeMount() {
      this.popoverKey = this.generateKey();
    },

    created: function () {
      this.flowData = this.parsedData
    },

    components: {
      'item-add-form': ItemAddForm
    },

    methods: {
      delItem: function (parentDom, item, index) {
        this.flowData = this.flowData.rmIndex(index);
        if (this.hideMyBlock[index]) this.hideMyBlock[index] = false;
        this.$emit('input', this.flowData)
      },

      closeBlock: function (index, e) {
        this.$set(this.hideMyBlock, index, !this.hideMyBlock[index])
      },

      generateKey: function () {
        return '_' + Math.random().toString(36).substr(2, 9);
      },

      newItem: function (obj) {

        let oj = {
          'name': obj.key || 'null',
          'type': obj.type
        };
        if (obj.type === 'array' || obj.type === 'object') {
          oj.childParams = obj.val;
          oj.remark = null
        } else {
          oj.childParams = null;
          oj.remark = obj.val
        }

        this.flowData.push(oj);
        this.$emit('input', this.flowData);
      },

      keyInputBlur: function (item, e) {
        if(item.name.length <= 0) {
          item.name = 'null';
          e.target.focus();
        }

        console.debug(item);
        console.debug(e);
      }
    }
  }

</script>