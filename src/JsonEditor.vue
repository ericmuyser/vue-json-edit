<template>
    <json-view :parsedData="parsedData" v-model="parsedData"></json-view>
</template>


<script>
  export default {
    name: 'JsonEditor',
    props: {'objData': {required: true}},

    data: function () {
      return {
        'parsedData': [],
      }
    },

    created: function () {
      this.parsedData = this.jsonParse(this.objData)
    },

    watch: {
      'parsedData': {
        handler(newValue, oldValue) {
          this.$emit('input', this.makeJson(this.parsedData))
        },
        deep: true
      }
    },

    methods: {
      jsonParse: function (jsonStr) {

        let parseJson = (json) => {
          let result = [];
          let keys = Object.keys(json);
          keys.forEach((k) => {
            let val = json[k];
            let parsedVal = val;

            if (this.getType(val) === 'object') {
              parsedVal = parseJson(val)
            } else if (this.getType(val) === 'array') {
              parsedVal = parseArray(val)
            }

            let opt = {
              'name': k,
              'type': this.getType(val)
            };

            if (opt.type === 'array' || opt.type === 'object') {
              opt.childParams = parsedVal;
              opt.remark = null
            } else {
              opt.childParams = null;
              opt.remark = parsedVal
            }

            result.push(opt)
          });
          return result
        };

        let parseArray = (arrayObj) => {
          let result = [];
          for (let i = 0; i < arrayObj.length; ++i) {
            let val = arrayObj[i];
            let parsedVal = val;
            if (this.getType(val) === 'object') {
              parsedVal = parseJson(val)

            } else if (this.getType(val) === 'array') {
              parsedVal = parseArray(val)
            }

            let opt = {
              'name': null,
              'type': this.getType(val)
            };

            if (opt.type === 'array' || opt.type === 'object') {
              opt.childParams = parsedVal;
              opt.remark = null
            } else {
              opt.childParams = null;
              opt.remark = parsedVal
            }

            result.push(opt)
          }
          return result
        };

        let parseBody = (json) => {
          return parseJson(json);
        };

        return parseBody(jsonStr)
      },

      getType: function (obj) {
        if(obj === null) {
          return 'null';
        }

        switch (Object.prototype.toString.call(obj)) {
          case '[object Array]':
            return 'array';

          case '[object Object]':
            return 'object';

          default:
            return typeof(obj);

        }
      },

      makeJson: function (dataArr) {

        let revertWithObj = function (data) {
          let r = {};
          for (let i = 0; i < data.length; ++i) {
            let el = data[i];
            let key, val;
            key = el.name;
            if (el.type === 'array') {
              val = revertWithArray(el.childParams)

            } else if (el.type === 'object') {
              val = revertWithObj(el.childParams)

            } else {
              val = el.remark
            }

            r[key] = val
          }
          return r
        };

        let revertWithArray = function (data) {
          let arr = [];
          for (let i = 0; i < data.length; ++i) {
            let el = data[i];
            let r;
            if (el.type === 'array') {
              r = revertWithArray(el.childParams)

            } else if (el.type === 'object') {
              r = revertWithObj(el.childParams)

            } else {
              r = el.remark
            }

            arr.push(r)
          }
          return arr
        };

        let revertMain = function (data) {
          return revertWithObj(data);
        };

        return revertMain(dataArr)
      }
    }
  }

</script>

<style lang="less">
    @import url('./assets/styles/common.less');
</style>
