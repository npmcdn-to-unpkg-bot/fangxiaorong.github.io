<template>
  <div>
    <div class='head'>One day I have a dream <br />One day I try to finish this. <br />This is my life.</div>
    <div v-for='article in articles'>
      <div><h2>{{ article.title }}</h2></div>
      <div>{{ article.short }}</div>
    </div>
  </div>
</template>

<script>
  import { AVRequest } from '../common/Request';

  export default {
    created() {
      if (this.articlesinfo.page === 0) {
        this.fetchData();
      }
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
        articlesinfo: {
          page: 0,
        },
        articles: [],
        message: 'This is Message1111.',
      };
    },
    methods: {
      fetchData() {
        /* eslint new-cap: ["error", { "capIsNew": false }] */
        const avRequest = AVRequest();
        avRequest.getArticles(this.articlesinfo.page, (error, data) => {
          if (!error) {
            this.articles = data.results;
            this.articlesinfo.count = data.count;
          }
        });
      },
    },
  };
</script>
