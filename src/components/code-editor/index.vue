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
      date: new Date().getTime()
    }
  },
  methods: {
    // 初始化编辑器
    initEditor () {
    /* eslint-disable */
    monaco.editor.create(document.getElementById(`code-editor-[${this.date}]`), {
      value: 
`<?php
  /**
   * 后台隐私协议设置
   * @return \think\Response
   * @throws \think\db\exception\DataNotFoundException
   * @throws \think\db\exception\DbException
   * @throws \think\db\exception\ModelNotFoundException
   */
  public function userPrivacy()
  {
      $privacy_agreement = $this->request->param("privacy_agreement");
      if(empty($privacy_agreement)){
          return $this->buildSuccess(['privacy_agreement' => help::get_help()[3]['des']]);
      }

      (new help())
          ->where(['type' => 3])
          ->save(['description' => $privacy_agreement]);
      Cache::delete('cache_help');
      return $this->buildSuccess();
  }
?>`
        ,
        language: 'php', //语言
        theme: 'vs-dark', //主题
        autoIndent: true //自动缩进
      })
    },
    customKeys(){
      document.getElementById(`code-editor-[${this.date}]`).addEventListener('keydown', e => {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
          e.preventDefault();
          this.$Message.success('保存成功！');
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
