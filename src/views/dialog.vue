<template>
  <div class="dialog" :class="[visible === 'true' ? 'show' : 'hide']" @click="hiddenDialog">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['visible'],
    methods: {
      hiddenDialog() {
        window.console.log('xxxxdsafjsadlfjds');
        this.visible = 'false';
      },
    },
  };
</script>

<style scoped='true'>

.dialog { position: fixed; top: 0; left: 0; bottom: 0; right: 0; background: rgba(0, 0, 0,0.1); text-align: center; animation-fill-mode: both; }
.dialog > .content { display: inline-block; min-width: 100px; min-height: 100px; max-width: 80%; background: white; border-radius: 4px; padding: 10px; overflow: hidden; }

@keyframes showdialog { from { margin: 0 auto 0 auto; } to { margin: 20% auto 0 auto; } }
@keyframes hidedilaog { from { margin: 20% auto 0 auto; } to { margin: 0 auto 0 auto; } }
@keyframes idel { from { visibility: hidden; } to { visibility: hidden; } }


.dialog.hide { animation: idel 0.5s ease 0.1s; visibility: hidden; }
.dialog.show { animation: idel 0.5s ease 0.1s; visibility: visible; }
.dialog.hide > .content {  animation: hidedialog 0.5s ease 0.1s; }
.dialog.show > .content {  animation: showdialog 0.5s ease 0.1s; }
</style>
