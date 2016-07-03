<template>
  <div>
    <div class='head'>One day I have a dream <br />One day I try to finish this. <br />This is my life.</div>
    <div class="content" v-for='article in articles'>
      <div class="article-head">
        <h2><a v-link="'article/' + article.objectId">{{ article.title }}</a></h2>
        <hr />
      </div>
      <markdown :markdown="article.content" class="article-content"></markdown>
    </div>
  </div>
</template>

<script>
  import { avInstance } from '../common/Request';
  import Markdown from '../views/markdown.vue';

  export default {
    created() {
      if (this.articlesinfo.page === 0) {
        this.fetchData();
      }
    },
    data() {
      return {
        articlesinfo: {
          page: 0,
        },
        articles: [],
        message: 'This is Message1111.',
      };
    },
    components: {
      Markdown,
    },
    methods: {
      // highlightCode() {
      //   const codeBlocks = this.$el.querySelectorAll('code[class*="language-"]');
      //   const that = this;
      //   for (let idx = 0; idx < codeBlocks.length; idx ++) {
      //     const codeBlock = codeBlocks[idx];
      //     const lang = codeBlock.className.split('-').pop();
      //     const nodes = codeBlock.childNodes;
      //     const isOrig = (nodes.length > 0) && (nodes[0].nodeType === 3);
      //     if (isOrig) {
      //       if (Prism.languages[lang]) {
      //         const code = Prism.highlight(utility.getInnerText(codeBlock), Prism.languages[lang]);
      //         codeBlock.innerHTML = code;
      //       } else {
      //         loadPluginScript('prism/components/prism-sql.js', (() => {
      //           that.highlightCode();
      //         }));
      //       }
      //     }
      //   }
      // },
      decodeData(data) {
        this.articles = data.results;
        // const md = new Remarkable({
        //   xhtmlOut: true,
        //   breaks: true,
        // });
        // this.articles.forEach((article) => {
        //   const rwArticle = article;
        //   rwArticle.content = md.render(article.content);
        // });
        this.articlesinfo.count = data.count;

        // window.setTimeout(this.highlightCode, 100);
      },
      fetchData() {
        avInstance.getPosts(this.articlesinfo.page, (error, data) => {
          if (!error) {
            this.decodeData(data);
          }
        });
      },
    },
  };
</script>

<style>
  .content { max-width: 1024px; margin: auto; padding: 10px; width: 100%; box-sizing: border-box; word-wrap: break-word; }
  .article-head > hr { margin: 0 0 5px 0; }
</style>