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
    <dialog :visible.sync="showDialog">
      <div style="font-size: 2em;">Dialog Title</div>
      <div style="padding: 1em 4em;">
        <div style="font-size: 10em; padding: 0 0.3em; border-radius: 4px; border: solid 1px #EEEEEE; color: #999999; display: inline-block;">+</div>
        <div style="margin-top: 1em;">上传文件: {{ uploadInfo.name }}</div>
      </div>
      <div style="padding: 10px 20px; margin: 0 1.5em; background: #3FB3FB; color: white; border-radius: 3px;" @click.stop.prevent="continueUpload">确认上传</div>
    </dialog>
  </div>
</template>

<script>
  import Remarkable from 'remarkable';
  import Dialog from '../views/dialog.vue';
  import { githubInstance, avInstance } from '../common/Request';

  export default {
    ready() {
      this.clearDocumentDragEvent();
    },
    components: {
      Dialog,
    },
    data() {
      const items = [];
      for (let idx = 0; idx < 100; idx ++) {
        items.push(`xxx:${idx}`);
      }
      return {
        items,
        path: ['master'],
        showDialog: 'false',
        uploadInfo: {
          name: '',
          content: '',
        },
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
          this.uploadInfo.content = e.target.result;
        });
        reader.readAsText(file);
        this.uploadInfo.name = file.name;
        this.showDialog = 'true';
      },
      continueUpload() {
        const name = this.uploadInfo.name;
        const content = this.uploadInfo.content;
        githubInstance.changeUser('fangxiaorong');
        githubInstance.changeRepo('blog');
        githubInstance.writeFile('master', name, content,
          'api commit.', (error, data /* , status, xhr */) => {
            if (!error) {
              window.console.log(data);
              avInstance.writePost(null, githubInstance.getCurrentUserName(),
                name, content, ['技术', '测试', 'Markdown'], data.content.sha, data.content.download_url);
            }
          }
        );
        if (this.uploadInfo.content) {
          const md = new Remarkable({
            highlight(str, lang) {
              window.console.log(str);
              window.console.log(lang);
              return '';
            },
          });
          window.console.log(md.render(this.uploadInfo.content));
        }
        this.showDialog = 'false';
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
