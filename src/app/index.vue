<template>
  <div class="test">
    <nav-bar></nav-bar>
    <router-view class="view" transition="test" transition-mode="out-in"></router-view>
  </div>
</template>

<script>
  import NavBar from './navbar.vue';

  export default {
    components: {
      NavBar,
    },
  };
</script>

<style>
  html, body { margin: 0; padding: 0; }
  ul { list-style: none; }
  .clear:after { display: block; content: ''; clear: both; }

  .fix-top { position: fixed; top: 0; left: 0; }

  .head { background: url('/static/images/background.jpg'); padding-top: 50px; padding-bottom: 10px; color: white; text-align: center; line-height: 1.5em; }
</style>
