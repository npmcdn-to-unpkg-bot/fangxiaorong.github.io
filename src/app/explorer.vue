<template>
  <div style='overr'>
    <div class='head'><br/>Hello<br/></div>
    <div><ul><li v-for='node in path'>{{node}}</li></ul></div>
    <div id="explorer">
      <div style='width: 90px; height: 80px; text-align: center; display: inline-block;' v-for='item in items'>
        <img src='/static/images/icon-file.png' />
        <div style='width: auto; height: auto;'>{{ item }}</div>
      </div>
      <div id="dropBox" @dragover="dragoverEvent" @drop="dropEvent"></div>
    </div>
  </div>
</template>

<script>
  import Remarkable from 'remarkable';

  export default {
    ready() {
      this.clearDocumentDragEvent();
    },
    data() {
      const items = [];
      for (let idx = 0; idx < 3; idx ++) {
        items.push(`xxx:${idx}`);
      }
      return {
        items,
        path: ['master'],
      };
    },
    methods: {
      clearDocumentDragEvent() {
        const idleDocument = document.body;
        function idealEvent(e) {
          e.preventDefault();
        }
        idleDocument.addEventListener('dragenter', idealEvent, false);
        idleDocument.addEventListener('dragleave', idealEvent, false);
        idleDocument.addEventListener('dragover', idealEvent, false);
        idleDocument.addEventListener('drop', idealEvent, false);
      },
      dragenterEvent(e) {
        e.preventDefault();
        window.console.log(e);
      },
      dragleaveEvent(e) {
        e.preventDefault();
        window.console.log(e);
      },
      dragoverEvent(e) {
        e.stopPropagation();
        e.preventDefault();
      },
      dropEvent(e) {
        e.stopPropagation();
        e.preventDefault();

        const fileList = e.dataTransfer.files;
        for (let index = 0; index < fileList.length; index ++) {
          const file = fileList[index];
          window.console.log(file);
          if (file.type.indexOf('markdown') === -1) {
            window.console.log('无效的Markdown文件。');
          } else {
            this.uploadMarkdown(file);
          }
        }
      },
      uploadMarkdown(file) {
        const reader = new FileReader();
        reader.onload = ((e) => {
          window.console.log(e.target.result);
          const md = new Remarkable({
            highlight(str, lang) {
              window.console.log(str);
              window.console.log(lang);
              return '';
            },
          });
          window.console.log(md.render(e.target.result));
        });
        reader.readAsText(file);
      },
      changePath(path) {
        window.console.log(path);
      },
    },
  };
</script>

<style>
  #explorer { position: relative; min-height: 100%; }
  #explorer #dropBox { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }
</style>
