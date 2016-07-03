<template>
  <div>
    {{{ html }}}
  </div>
</template>

<script>
import { utility, loadPluginScript, xRemarkable } from '../common/common';
// import Remarkable from 'remarkable';
import Prism from 'prismjs';

export default {
  props: ['markdown'],
  computed: {
    html() {
      let result = '';
      if (this.markdown) {
        result = this.rendMarkdown();
        window.setTimeout(this.highlightCode, 100);
      }
      return result;
    },
  },
  methods: {
    highlightCode() {
      if (!this.$el) {
        return;
      }

      const codeBlocks = this.$el.querySelectorAll('code[class*="language-"]');
      const that = this;
      for (let idx = 0; idx < codeBlocks.length; idx ++) {
        const codeBlock = codeBlocks[idx];
        const lang = codeBlock.className.split('-').pop();
        const nodes = codeBlock.childNodes;
        const isOrig = (nodes.length > 0) && (nodes[0].nodeType === 3);
        if (isOrig) {
          if (Prism.languages[lang]) {
            const code = Prism.highlight(utility.getInnerText(codeBlock), Prism.languages[lang]);
            codeBlock.innerHTML = code;
          } else {
            loadPluginScript(`prism/components/prism-${lang}.js`, (() => {
              that.highlightCode();
            }));
          }
        }
      }
    },
    rendMarkdown() {
      // const md = new Remarkable({
      //   xhtmlOut: true,
      //   breaks: true,
      // });
      return xRemarkable.render(this.markdown);
    },
  },
};

</script>

