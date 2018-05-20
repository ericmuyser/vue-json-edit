<template>
    <div class="j-w">
        <h1 class="t">Vue-Json-Edit</h1>
        <div class="editor-w clearfix">
            <div class="w-2">
                <div class="editor">
                    <JsonEditor :objData="jsonData" v-model="jsonData"></JsonEditor>
                </div>
            </div>
            <div class="w-2">
                <div class="code-pre">
                    <div slot="content">
						<pre>
							<code class="json" id="res_code"></code>
						</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import hljs from 'highlight.js'

  export default {
    name: 'app',
    data() {
      return {
        jsonData: {
          data: {
            id: 'ca6c75be-4413-4c09-a861-ce343903740f',
            type: 'users',
            attributes: {
              title: 'Mr',
              first_name: 'Toyin',
              last_name: 'Butler',
              full_name: 'Mr Toyin Butler',
              email: 'toyin@socrates.systems',
              phone1: '0844 333 2222',
              phone2: '0207 888 9999',
              position: 'Lead Developer',
              address: {
                line1: 'Unit 6B',
                line2: 'Limes Court',
                line3: 'Conduit Lane',
                town: 'Hoddesdon',
                county: 'Hertfordshire',
                postcode: 'EN11 8EP',
                country: 'GB',
              },
              status: 'active',
              public: false,
              max_referral_limit: 0,
              metadata: {},
              created_at: '2018-05-19T14:21:33+00:00',
              updated_at: '2018-05-19T14:21:33+00:00'
            }
          }
        }
      }
    },
    watch: {
      'jsonData':
        function () {
          let c = this.formatJson(JSON.stringify(this.jsonData));
          this.drawResCode(c)
        }
    },

    methods: {
      //JSON format print
      formatJson: function (txt, compress) {
        if (/^\s*$/.test(txt)) {
          return;
        }

        let indentChar = "  ";
        let data = '';

        try {
          data = eval("(" + txt + ")");
        } catch (e) {
          throw (e.description);
        }

        let draw = [],
          line = compress ? "" : "\n",
          nodeCount = 0,
          maxDepth = 0;

        let notify = function (name, value, isLast, indent, formObj) {
          nodeCount++;
          let tab = "";
          for (let i = 0; i < indent; i++) tab += indentChar;
          tab = compress ? "" : tab;
          maxDepth = ++indent;

          if (value && value.constructor === Array) {
            draw.push(
              tab + (formObj ? '"' + name + '":' : "") + "[" + line
            );

            for (let i = 0; i < value.length; i++)
              notify(i, value[i], i === value.length - 1, indent, false);
            draw.push(
              tab + "]" + (isLast ? line : "," + line)
            );
          } else if (value && typeof value === "object") {
            draw.push(
              tab + (formObj ? '"' + name + '":' : "") + "{" + line
            );

            let len = 0,
              i = 0;

            for (let key in value) len++;
            for (let key in value) notify(key, value[key], ++i === len, indent, true);

            draw.push(
              tab + "}" + (isLast ? line : "," + line)
            );
          } else {
            if (typeof value === "string") value = '"' + value + '"';

            draw.push(
              tab +
              (formObj ? '"' + name + '":' : "") +
              value +
              (isLast ? "" : ",") +
              line
            );
          }
        };

        notify("", data, true, 0, false);
        return draw.join("");
      },

      drawResCode: function (content) {
        let target = document.getElementById('res_code');
        target.textContent = content;
        hljs.highlightBlock(target)
      }
      ,
    },
    mounted: function () {
      let c = this.formatJson(JSON.stringify(this.jsonData));
      this.drawResCode(c)
    }
  }
</script>

<style>
    @import url('../node_modules/highlight.js/styles/github.css');
</style>


