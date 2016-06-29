import md5 from 'md5';
import { Base64 } from './common.js';

// class NetRequest {
//     constructor() {
//         this.baseUrl = 'http://www.baidu.com';
//         this.method = 'GET';
//         this.headers = undefined;
//         this.data = undefined;
//         this.path = undefined;
//     }

//     setMethod(method) {
//         this.method = method;
//     }

//     setHeaders(headers) {
//         this.headers = headers;
//     }

//     setData(data) {
//         this.data = data;
//     }

//     start(path, callback) {
//         const xhr = new window.XMLHttpRequest();
//         let url = this.baseUrl;
//         this.path = path;

//         if (/^https?:\/\//.test(this.path)) {
//             url = this.path;
//         } else {
//             url += this.path.substring(0, 1) === '/' ? this.path : (`/${this.path}`);
//         }

//         xhr.onreadystatechange = () => {
//             if ((xhr.readyState === 4) && callback) {
//                 if ((xhr.status >= 200) && (xhr.status <= 300)) {
//                     callback.success(xhr.responseText);
//                 } else {
//                     callback.error(xhr.status);
//                 }
//             }
//         };
//         xhr.open(this.method, url, true);

//         const that = this;
//         Object.keys(this.headers || {}).forEach((key) => {
//             xhr.setRequestHeader(key, that.headers[key]);
//         });

//         try {
//             xhr.send(this.data ? JSON.stringify(this.data) : null);
//         } catch (exception) {
//             window.console.log(exception);
//         }
//     }

//     static doRequest(path, method, headers, data, callback) {
//         const request = new NetRequest();
//         request.method = method;
//         request.headers = headers;
//         request.data = data;
//         request.start(path, callback);
//         return request;
//     }
// }

// export default NetRequest;


function ajax(options, cb) {
  const xhr = new window.XMLHttpRequest();
  xhr.dataType = options.dataType;
  if (typeof xhr.overrideMimeType === 'function') {
    xhr.overrideMimeType(options.mimeType);
  }
  xhr.open(options.type, options.url);
  if (options.data && options.type !== 'GET') {
    window.console.log(options.contentType);
    xhr.setRequestHeader('Content-Type', options.contentType);
  }

  const ref = options.headers;
  for (const name in ref) {
    if (ref[name]) {
      xhr.setRequestHeader(name, ref[name]);
    }
  }
  xhr.onreadystatechange = (() => {
    let name1;
    let ref1;
    if (xhr.readyState === 4) {
      ref1 = options.statusCode;
      if (ref1) {
        name1 = xhr.status;
        if (typeof ref1[name1] === 'function') {
          ref1[name1]();
        }
      }
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 302) {
        return cb(null, xhr);
      } else {
        return cb(xhr);
      }
    }
    return;
  });
  return xhr.send(options.data);
};

/* **************** */
const ETagResponse = (function() {
  function ETagResponse(eTag1, data1, status1) {
    this.eTag = eTag1;
    this.data = data1;
    this.status = status1;
  }

  return ETagResponse;
})();

const _cachedETags = {};

const DEFAULT_CACHE_HANDLER = {
  get: function(method, path) {
    return _cachedETags[method + " " + path];
  },
  add: function(method, path, eTag, data, status) {
    return _cachedETags[method + " " + path] = new ETagResponse(eTag, data, status);
  }
};
/* ********************* */

function Request(clientOptions) {
  if (!clientOptions.disableCache) {
      clientOptions.cacheHandler = clientOptions.cacheHandler || DEFAULT_CACHE_HANDLER;
  }

  return function(method, path, data, configs, callback) {
    let options = configs;
    let cb = callback;
    if (typeof data === 'function') {
      cb = data;
      data = undefined;
    } else if (typeof options === 'function') {
      cb = options;
      options = undefined;
    }

    if (!options) {
      options = {
        raw: false,
        isBase64: false,
        isBoolean: false,
        contentType: 'application/json',
      };
    }

    const ajaxConfig = {
      url: path,
      type: method,
      headers: {},
      processData: false,
      data: !options.raw && data && JSON.stringify(data) || data,
      contentType: options.contentType,
    };
    if (!options.raw) {
      ajaxConfig.dataType = 'json';
    }

    if (clientOptions.headers) {
      Object.keys(clientOptions.headers).forEach((key) => {
        ajaxConfig.headers[key] = clientOptions.headers[key];
      });
    }

    if (options.isBase64) {
      ajaxConfig.mimeType = 'text/plain; charset=x-user-defined';
    }
    if (!/^https?:/.test(path)) {
      ajaxConfig.url = `${clientOptions.rootURL}${path}`;
    }
    if (!clientOptions.disableCache) {
      const etagResponse = clientOptions.cacheHandler.get(method, ajaxConfig.url);
      if (etagResponse) {
        ajaxConfig.headers['If-None-Match'] = etagResponse.eTag;
      } else {
        ajaxConfig.headers['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    if (clientOptions.acceptHeader) {
      ajaxConfig.headers.Accept = clientOptions.acceptHeader;
    }
    if (clientOptions.token || (clientOptions.username && clientOptions.password)) {
      if (clientOptions.token) {
        ajaxConfig.headers.Authorization = `token ${clientOptions.token}`;
      } else {
        const auth = btoa(`${clientOptions.username}:${clientOptions.password}`);
        ajaxConfig.headers.Authorization = `Basic ${auth}`;
      }
    }

    return ajax(ajaxConfig, (err, val) => {
      const jqXHR = err || val;

      if (err) {
        const errors = new Error(jqXHR.responseText);
        errors.status = jqXHR.status;
        if (jqXHR.getResponseHeader('Content-Type') === 'application/json; charset=utf-8') {
          if (jqXHR.responseText) {
            errors.json = JSON.parse(jqXHR.responseText);
          } else {
            errors.json = '';
          }
        }
        return cb(errors);
      } else {
        if (jqXHR.status === 304) {
          const eTagResponse = clientOptions.cacheHandler.get(method, path);
          if (clientOptions.useETags && eTagResponse) {
            return cb(null, eTagResponse.data, eTagResponse.status, jqXHR);
          } else {
            return cb(null, jqXHR.responseText, jqXHR.status, jqXHR);
          }
        } else if (jqXHR.status === 302) {
          return cb(null, jqXHR.getResponseHeader('Location'));
        } else if (!(jqXHR.status === 204 && options.isBoolean)) {
          let retData;
          if (jqXHR.responseText && ajaxConfig.dataType === 'json') {
            retData = JSON.parse(jqXHR.responseText);
// const links = jqXHR.getResponseHeader('Link');
// const ref = (links != null ? links.split(',') : void 0) || [];
// for (j = 0, len = ref.length; j < len; j++) {
//     part = ref[j];
// ref1 = part.match(/<([^>]+)>;\ rel="([^"]+)"/), discard = ref1[0],href = ref1[1], rel = ref1[2];
//     retData[rel + "_page_url"] = href;
// }
          } else {
            retData = jqXHR.responseText;
          }
          if (method === 'GET' && options.isBase64) {
            let converted = '';
            for (i = k = 0, ref2 = retData.length; 0 <= ref2 ? k < ref2 : k > ref2;
              i = 0 <= ref2 ? ++k : --k) {
              converted += String.fromCharCode(retData.charCodeAt(i) & 0xff);
            }
            retData = converted;
          }
          if (method === 'GET' && !clientOptions.disableCache &&
            jqXHR.getResponseHeader('ETag') && clientOptions.useETags) {
              eTag = jqXHR.getResponseHeader('ETag');
              clientOptions.cacheHandler.add(method, path, eTag, retData, jqXHR.status);
          }
          return cb(null, retData, jqXHR.status, jqXHR);
        }
      }

      return;
    });
  };
}

export const GithubRequest = ((params) => {
  const options = {
    rootURL: 'https://api.github.com'
  };
  Object.keys(params || {}).forEach((key) => {
    options[key] = params[key];
  });
  const request = Request(options);
  const context = {};

  return {
    changeUser(username) {
      context.username = username;
    },
    changeRepo(reponame) {
      context.reponame = reponame;
    },
    getCurrentUserName() {
      return context.username;
    },
    getSha(branch, path, cb) {
      branch = branch ? `?ref=${branch}` : '';
      request('GET', `/repos/${context.username}/${context.reponame}/contents/${path}${branch}`, cb);
    },
    getTree(sha, cb) { // GET /repos/:owner/:repo/git/trees/:sha
      request('GET', `/repos/${context.username}/${context.reponame}/git/trees/${sha}`, cb);
    },
    getContent(ref, path, raw) {
      const realPath = path ? `${encodeURI(path)}` : '';
      return request('GET', `/repos/${context.username}/${context.reponame}/contents/${realPath}`, {
         ref,
      }, {
        raw,
      }, cb);
    },
    writeFile(branch, path, content, message, cb) {
      window.console.log(Base64.encode(content));

      this.getSha(branch, path, (error, data, status, xhr) => {
        const commit = {
          branch,
          message,
          // committer: {
          //     name: options.username,
          //     email: options.email
          // },
          content: Base64.encode(content)
        };
        if (!error && data.sha) {
          commit.sha = data.sha;
        }
        request('PUT', `/repos/${context.username}/${context.reponame}/contents/${path}`,
          commit, cb);
      });
    },
    deleteFile(branch, path, message, cb) {
      this.getSha(branch, path, (error, data, status, xhr) => {
        if (!error && data.sha) {
          const commit = {
            branch,
            message,
            // committer: {
            //     name: options.username,
            //     email: options.email
            // },
            sha: data.sha,
          };
          request('DELETE', `/repos/${context.username}/${context.reponame}/contents/${path}`,
            commit, cb);
        }
      });
    },
  };
});

function sign(key, isMasterKey) {
  const now = new Date().getTime();
  const signature = md5(now + key);
  if (isMasterKey) {
    return `${signature},${now},master`;
  }
  return `${signature},${now}`;
}

/* eslint new-cap: ["error", { "capIsNew": false }] */
export const AVRequest = (params) => {
  const options = {
    rootURL: 'https://api.leancloud.cn/1.1',
    headers: {
      'X-LC-Id': 'qa69ysxnmswd1noiv7anmzcux3j4gt3vv67y9fwitro74jcw',
      'Content-Type': 'application/json;charset=UTF-8',
      'X-LC-Sign': sign('m25qtxnn0i59tkxckodb7r8t3qhchibousbg4e1tczs5usk5'),
    },
    disableCache: true,
  };
  Object.keys(params || {}).forEach((key) => {
    options[key] = params[key];
  });
  const request = Request(options);
  // const context = {};

  return {
    getCategories(cb) {
      const path = '/classes/Category';
      request('GET', path, cb);
    },
    getArticles(page, cb) {
      const start = (page - 1) * 10;
      const path = `/classes/Article?count=1&limit=10&order=-updatedAt&keys=-content&skip=${start}`;
      request('GET', path, cb);
    },
    getPosts(page, cb) {
      const start = (page - 1) * 10;
      const path = `/classes/Post?count=1&limit=10&order=-updatedAt&skip=${start}`;
      request('GET', path, cb);
    },
    writePost(uid, user, title, content, tags, sha, path, cb) {
      const postObject = {
        user,
        title,
        content,
        tags,
        sha,
        path,
      };
      if (uid) {
        request('PUT', `/classes/Post/${uid}`, postObject, cb);
      } else {
        request('POST', '/classes/Post', postObject, cb);
      }
    }
  };
};

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


export const githubInstance = GithubRequest({username: 'fangreater@gmail.com', password: 'Fang19851122'});
export const avInstance = AVRequest();
