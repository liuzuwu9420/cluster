<template>
  <div class="ace-container">
    <div ref="ace" class="ace-editor" />

    <div v-show="toggle" class="config-panel">
      <div>
        <div class="item">
          <label class="title">语言</label>
          <el-select
            v-model="modePath"
            class="value"
            size="mini"
            value-key="name"
            @change="handleModelPathChange"
          >
            <el-option
              v-for="mode in modeArray"
              :key="mode.name"
              :label="mode.name"
              :value="mode.path"
            />
          </el-select>
        </div>

        <div class="item">
          <label class="title">换行</label>
          <el-select
            v-model="wrap"
            class="value"
            size="mini"
            value-key="name"
            @change="handleWrapChange"
          >
            <el-option
              v-for="wrap in wrapArray"
              :key="wrap.name"
              :label="wrap.name"
              :value="wrap.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="bookmarklet" @click="toggleConfigPanel" />
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/snippets/sh'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/json'
import 'ace-builds/src-noconflict/snippets/yaml'
import 'ace-builds/src-noconflict/snippets/text'
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-sh'

// const themeArray = [{
//   name: 'monokai',
//   path: 'ace/theme/monokai'
// }]

const wrapArray = [{
  name: '开启',
  value: true
}, {
  name: '关闭',
  value: false
}]

const modeArray = [{
  name: 'shell',
  path: 'ace/mode/sh'
}, {
  name: 'JavaScript',
  path: 'ace/mode/javascript'
}, {
  name: 'YAML',
  path: 'ace/mode/yaml'
}, {
  name: 'Json',
  path: 'ace/mode/json'
}, {
  name: 'Text',
  path: 'ace/mode/text'
}]

export default {
  props: {
    value: {
      required: true,
      type: String,
      default: ''
    },
    reset: {
      type: Boolean,
      default: false
    },
    maxLines: {
      type: Number,
      default: 41
    },
    minLines: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      aceEditor: null,
      toggle: false,
      wrap: true,
      themePath: 'ace/theme/monokai',
      modePath: 'ace/mode/sh',
      modeArray: modeArray,
      wrapArray: wrapArray
    }
  },
  watch: {
    value: {
      handler: function(val) {
        this.aceEditor.getSession().setValue(val)
      },
      deep: true
    },
    reset: {
      handler: function() {
        this.aceEditor.getSession().setValue(this.value)
      },
      deep: true
    }
  },
  mounted() {
    this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: this.maxLines,
      minLines: this.minLines,
      fontSize: 14,
      value: this.value ? this.value : '',
      theme: this.themePath,
      mode: this.modePath,
      wrap: this.wrap,
      tabSize: 4
    })
    // 激活自动提示
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    })
    this.aceEditor.getSession().on('change', this.change)
  },
  methods: {
    toggleConfigPanel() {
      this.toggle = !this.toggle
    },
    change() {
      this.$emit('input', this.aceEditor.getSession().getValue())
    },
    handleModelPathChange(modelPath) {
      this.aceEditor.getSession().setMode(modelPath)
    },
    handleWrapChange(wrap) {
      this.aceEditor.getSession().setUseWrapMode(wrap)
    }
  }
}
</script>

<style lang='scss' scoped>
.ace-container {
  position: relative;
  width: 100%;
  min-height: 50px;
  padding-right: 6px;
  .config-panel {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 100%;
    overflow: scroll;
    box-shadow: grey -5px 2px 3px;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1;

    .item {
      margin: 10px auto;
      text-align: center;

      .title {
        color: white;
        margin: 0 10px;
        font-size: 14px;
      }
    }
  }

  .bookmarklet {
    position: absolute;
    right: 18px;
    bottom: 0;
    width: 20px;
    height: 20px;
    z-index: 2;
    cursor: pointer;
    border-width: 9px;
    border-style: solid;
    border-color: lightblue gray gray rgb(206, 173, 230);
    border-image: initial;
  }
}
</style>
