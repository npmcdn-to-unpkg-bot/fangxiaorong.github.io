import Remarkable from 'remarkable';
import md5 from 'md5';

export class Base64 {
  static cb_utob(c) {
    const fromCharCode = String.fromCharCode;
    if (c.length < 2) {
      const cc = c.charCodeAt(0);
      return cc < 0x80 ? c
        : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                      + fromCharCode(0x80 | (cc & 0x3f)))
        : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
          + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
          + fromCharCode(0x80 | ( cc         & 0x3f)));
    } else {
      const cc = 0x10000
        + (c.charCodeAt(0) - 0xD800) * 0x400
        + (c.charCodeAt(1) - 0xDC00);
      return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
              + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
              + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
              + fromCharCode(0x80 | ( cc         & 0x3f)));
    }
  }
  static utob(u) {
    return u.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, Base64.cb_utob);
  }
  static cb_encode(ccc) {
    const b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const padlen = [0, 2, 1][ccc.length % 3],
    ord = ccc.charCodeAt(0) << 16
        | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
        | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
    chars = [
        b64chars.charAt( ord >>> 18),
        b64chars.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
    ];
    return chars.join('');
  }
  static btoa (b) {
    return b.replace(/[\s\S]{1,3}/g, Base64.cb_encode);
  }
  static encode(content, urisafe) {
    if (!urisafe) {
      return Base64.btoa(Base64.utob(content));
    }
  }
}

export function loadPluginScript(path, callback) {
  if (!loadPluginScript.scripts) {
    loadPluginScript.scripts = {};
    loadPluginScript.container = document.getElementsByTagName('head')[0];
  }
  
  if (!loadPluginScript.scripts[path]) {
    const el = document.createElement('script');
    el.onload = el.onerror = el.onreadystatechange = (() => {
      const loaded = loadPluginScript.scripts[path].loaded;
      if (el.readyState && !(/^c|loade/.test(el.readyState)) || loaded) {
        return;
      }
      el.onload = el.onreadystatechange = null;
      loadPluginScript.scripts[path].loaded = true;

      if (callback) {
        callback();
      }
    });

    el.async = false;
    el.src = `static/plugin/${path}`;
    loadPluginScript.container.insertBefore(el, loadPluginScript.container.lastChild);
    loadPluginScript.scripts[path] = { loaded: false };
  }

  ///static/plugin/prism/components
}

export const utility = {
  getInnerText(el) {
    return (typeof el.textContent === 'string') ? el.textContent : el.innerText;
  },
  setInnerText(el, val) {
    if (typeof el.textContent === 'string') {
      el.textContent = val;
    } else {
      el.innerText = el;
    }
  }
};


function todo(md) {
  function parse(state, startLine, endLine, silent) {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (pos + 3 > max) { return false; }
    let result = /^\[( |x)\] (.*)/.exec(state.src.slice(pos, max));
    if (silent || !result) {
      return !!result;
    }

    const todos = [{mark: result[1], content: result[2]}];
    const test = state.tShift[startLine] > 0 ? /^\s+\[( |x)\] (.*)/ : /^\[( |x)\] (.*)/;
    let nextLine = startLine;
    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        break;
      }
      result = test.exec(state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]));
      if (!result) {
        break;
      }
      todos.push({mark: result[1], content: result[2]});
    }

    state.line = nextLine;
    state.tokens.push({
      type: 'todo',
      todos,
      isShift: state.tShift[startLine] > 0,
      lines: [ startLine, state.line ],
      level: state.level,
    });
    return true;
  }

  function render(tokens, id, options, env) {
    let result = '<ul class="todo">\n';
    tokens[id].todos.forEach((todo) => {
      const checkdClass = todo.mark === ' ' ? 'unchecked' : 'checked';
      result = `${result}<li class="${checkdClass}">${todo.content}</li>\n`;
    });
    if (tokens[id].isShift) {
      result = `<blockquote>\n${result}</ul></blockquote>`
    } else {
      result += '</ul>';
    }
    return result;
  }

  md.block.ruler.before('paragraph', 'todo', parse, {alt: []});
  md.renderer.rules.todo = render;
}


const xRemarkable = new Remarkable({
  xhtmlOut: true,
  breaks: true,
});
xRemarkable.use(todo);
xRemarkable.renderer.rules.fence_custom = {
  xscript(tokens, idx/*, options, env, instance */) {
    // window.console.log(arguments);
    const reg = /[^(]*(?:\((\S*)\))?(?:\[(\d*%?)x(\d*%?)\])/;
    let result = reg.exec(tokens[idx].params);
    if (!result) {
      window.console.log(`${tokens[idx].params.replace(/(^\s*)|(\s*$)/g, '')}[100%x200]`);
      result = reg.exec(`${tokens[idx].params.replace(/(^\s*)|(\s*$)/g, '')}[100%x200]`);
    }
    let src = '';
    if (result[1]) {
      src = `src='${result[1]}'`;
    } else {
      src = `srcdoc='${tokens[idx].content}'`;
    }
    const iframeId = md5(src);
    return `<div style='width: ${result[2]}; height: 1em; text-align: right;'><a href='javascript:void(0)' onclick='var frame = document.getElementById("${iframeId}"); if (frame.contentWindow) {frame.contentWindow.location.reload();} else {frame.window.location.reload();}'>reload</a></div><iframe id='${iframeId}' width='${result[2]}' height='${result[3]}' frameborder='0' ${src}></iframe>`;
  },
};

export { xRemarkable };
