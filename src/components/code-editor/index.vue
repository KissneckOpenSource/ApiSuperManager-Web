<style lang="less">
.code-editor{
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="code-editor" :id="`code-editor-[${date}]`">
  </div>
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'codeEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      date: new Date().getTime(),
      monacoInstance: null
    }
  },
  methods: {
    // 初始化编辑器
    initEditor () {
    /* eslint-disable */
      this.monacoInstance = monaco.editor.create(document.getElementById(`code-editor-[${this.date}]`), {
        value: this.value,
        language: 'php', //语言
        theme: 'vs-dark', //主题
        autoIndent: true //自动缩进
      })
      this.monacoInstance.onDidChangeModelContent((event) => {
        const newValue = this.monacoInstance.getValue();
        this.$emit('updateCode',newValue)
        console.log(newValue)
      })
    },
    customKeys(){
      document.getElementById(`code-editor-[${this.date}]`).addEventListener('keydown', e => {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
          e.preventDefault();
          this.$emit("saveCode",this.monacoInstance.getValue())
        }
      });
    }
  },
  watch: {
   
  },
  beforeDestroy () {
    try {
      document.getElementById(`code-editor-[${this.date}]`).removeEventListener('keydown')
    } catch (e) {

    }
  },
  mounted () {
    this.initEditor()
    this.customKeys() 
  }
}
</script>
