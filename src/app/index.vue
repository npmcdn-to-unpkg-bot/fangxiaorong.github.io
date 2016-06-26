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
