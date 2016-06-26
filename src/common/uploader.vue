<template>
  <div class="dropbox">
    <slot></slot>
    <slot name="entity"></slot>
  </div>
</template>

<script>
  export default {
    created() {
      this.initBox();
    },
    data() {
      return {

      };
    },
    methods: {
      initBox() {
      },
    },
  };
</script>
