<template>
  <div>
    <ul v-if="comments">
      <li v-for="comment in comments">
        <div>{{ comment.user }}</div>
        <div>{{ comment.content }}</div>
        <ul v-if="comment.follows">
          <li v-for="follow in comment.follows">
            <div>{{ follow.user }}</div>
            <div>{{ follow.content }}</div>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      xyz
      <textarea></textarea>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['comments'],
  };
</script>

<style scoped=true>
  textarea { resize: none; }
</style>
