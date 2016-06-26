<template>
  <div class='navbar clear fix-top'>
    <div class='logo'>Logo</div>
    <ul class='menu'>
      <li v-for="item in items">
        <a v-link="{path: item.path, exact: true}">{{ item.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {
            title: 'Home',
            path: '/',
          },
          {
            title: 'Explorer',
            path: '/explorer',
          },
          {
            title: 'About',
            path: '/about',
          },
        ],
      };
    },
  };
</script>
