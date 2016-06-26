<template>
  <div style='overr'>
    <div class='head'><br/>Hello<br/></div>
    <div><ul><li v-for='node in path'>{{node}}</li></ul></div>
    <uploader>
      <div style='width: 90px; height: 80px; text-align: center; display: inline-block;' v-for='item in items'>
        <img src='/static/images/icon-file.png' />
        <div style='width: auto; height: auto;'>{{ item }}</div>
      </div>
    </uploader>
  </div>
</template>

<script>
  import Uploader from '../common/uploader.vue';

  export default {
    data() {
      const items = [];
      for (let idx = 0; idx < 100; idx ++) {
        items.push(`xxx:${idx}`);
      }
      return {
        items,
        path: ['master'],
      };
    },
    components: {
      Uploader,
    },
    methods: {
      changePath(path) {
        window.console.log(path);
      },
    },
  };
</script>
