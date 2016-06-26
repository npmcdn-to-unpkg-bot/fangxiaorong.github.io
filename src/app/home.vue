<template>
  <div>
    <div class='head'>One day I have a dream <br />One day I try to finish this. <br />This is my life.</div>
    <div v-for='category in categories'>
      <div><h2>{{ category.vname }}</h2></div>
      <ul>
        <li v-for='article in category.articles'><a v-link="'/article/' + article[0]">{{article[1]}}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { AVRequest } from '../common/Request';

  export default {
    created() {
      this.fetchData();
    },
    data() {
      // const githubRequest = GithubRequest({username: 'fangreater@gmail.com',
      //   password: 'Fang19851122'});
      // githubRequest.changeUser('fangxiaorong');
      // githubRequest.changeRepo('blog');
      // githubRequest.writeFile('master', 'test.txt', 'This is a new file for me!',
      //   'api commit.', (error, data, status, xhr) => {
      //     if (!error) {
      //         console.log(data);
      //     }
      // });
      // githubRequest.getSha('master', '', (error, data, status, xhr) => {
      //     if (!error) {
      //         console.log(data);
      //     }
      // })
      // githubRequest.getTree('master', (error, data, status, xhr) => {
      //     if (!error) {
      //         console.log(data);
      //     }
      // });
      return {
        categories: [],
        message: 'This is Message1111.',
      };
    },
    methods: {
      fetchData() {
        /* eslint new-cap: ["error", { "capIsNew": false }] */
        const avRequest = AVRequest();
        avRequest.getCategories((error, data) => {
          if (!error) {
            this.categories = data.results;
          }
        });
      },
    },
  };
</script>
