;(function(window){
  "use strict";

  window.Dooli = function(selector, options = {}) {
    return new DooliObject(selector, options);
  };

  class DooliObject {

    constructor(selector, options = {}) {
      if (options.isTag) {
        this.el = document.getElementsByTagName(selector);
      } else {
        this.el = document.getElementById(selector);
      }

      if (!this.el) {
        this.el = document.querySelectorAll(selector);
      }

      return this;
    }

    obj() {
      return this.el;
    }

    first() {
      this.el = this.el[0];

      return this;
    }

    num(i) {
      if (i >= this.el.length) i = 0;
      this.el = this.el[i];

      return this;
    }

    html() {
      if (arguments[0]) {
        this.el.innerHTML = arguments[0];
      }
      return this.el.innerHTML;
    }

    css(...rest) {
      for (let i = 0; i < rest.length; i++) {
        let style_name = rest[i].toLowerCase().split(":")[0];
        let style_ = rest[i].toLowerCase().split(":")[1];
        this.el.style[style_name] = style_;
      }

      return this;
    }

    addClass(...rest) {
      for (let i = 0; i++ < rest.length; this.el.classList.add(rest[i - 1]));

      return this;
    }

    removeClass(...rest) {
      for (let i = 0; i++ < rest.length; this.el.classList.remove(rest[i - 1]));

      return this;
    }

    clone() {
      return this.el.cloneNode(true);
    }

    focus() {
      this.el.focus();

      return this;
    }

    attr(...rest) {
      for (let i = 0; i < rest.length; i++) {
        let attr_ = rest[i].toLowerCase().split("=")[0];
        let attr_val = rest[i].toLowerCase().split("=")[1];
        this.el.setAttribute(attr_, attr_val);
      }

      return this;
    }

    get(...rest) {
      if (rest.length === 1) {
        return this.el.getAttribute(rest[0]);
      } else {
        for (var i = 0, arr = []; i++ < rest.length; arr.push(this.el.getAttribute(rest[i - 1])));
        return arr;
      }
    }

    append(...rest) {
      for (let i = 0; i < rest.length; i++) {
        this.el.appendChild(rest[i]);
      }
    }

    prepend(...rest) {
      for (let i = 0; i < rest.length; i++) {
         this.el.insertBefore(rest[i], this.el.firstChild);
      }
    }

    size() {
      return [this.el.offsetWidth, this.el.offsetHeight];
    }

    width() {
      return this.size()[0];
    }

    height() {
      return this.size()[1];
    }

    hide() {
      this.css("display:none");

      return this;
    }

    show() {
      this.css("display: block");

      return this;
    }

    click(callback, context = this) {
      const args = Array.prototype.slice.call(arguments);
      if (!args.length) {
          this.el.click();
          return this;
      }

      this.el.addEventListener('click', callback.bind(context));

      return this;
    }

    change(callback, context = this) {
      this.el.addEventListener('change', callback.bind(context));

      return this;
    }

    timer(timer, callback) {
      const now = Math.floor(Date.now() / 1000);
      const timeEnd = now + timer;
      const _timer = setInterval(() => {
        if (Math.floor(Date.now() / 1000) >= timeEnd && typeof callback === 'function') {
          clearInterval(_timer);
          callback();
        }
      }, 1000);

      return this;
    }

    bindEvent(event, callback, ctx) {
      this.removeEvent(event, callback, ctx);
      this.addEvent(event, callback, ctx);
    }

    bindMylty(el, items) {
      const keys = Object.keys(items);
      keys.forEach((key) => {
        this.bindEvent(key, items[key]);
      });
    }

    addEvent(event, callback, ctx) {
      const el = this.obj();
      if (window.addEventListener) {
        el.addEventListener(event, ctx ? callback.bind(ctx) : callback);
      } else {
        el.attachEvent(`on${event}`, ctx ? callback.bind(ctx) : callback);
      }
    }

    removeEvent(event, callback, ctx) {
        const el = this.obj();
        if (window.removeEventListener) {
            el.removeEventListener(event, ctx ? callback.bind(ctx) : callback);
        } else {
            el.detachEvent(`on${event}`, ctx ? callback.bind(ctx) : callback);
        }
    }
  }

  class TPL_ {

    constructor() {
      this.cache = [];
    }

    ge(id) {
      return document.getElementById(id);
    }

    init(selector) {
      this.tpl = this.ge(selector) || document.querySelector(selector);
      this.Dooli = new DooliObject();
      if (this.tpl == null) {
        console.error(`Element with selector = ${selector} in DOM not found`);
        return this.tpl;
      }
    }

    getContent(el) {
      return el.innerHTML;
    }

    setIteration(id, params = {}) {
      this.tpl = this.ge(id);
      const count = params.data ? params.data.length : 1;
      this.parse('count', count);

      if (params.data) {
        const data = params.data;
        let result = '';
        data.forEach((item) => {
          let string = this.tpl.innerHTML;
          const keys = Object.keys(item);
          keys.forEach((key) => {
            string = this.parseString(string, key, item[key]);
          });
          result += string;
        });

        this.tpl.innerHTML = result;
      }
    }

    setIfBlock(name, condition, isNotUpdate = false) {
      const blocks = document.getElementsByTagName('dooli:if');
      const keys = Object.keys(blocks);
      let el = null;
      keys.forEach((key) => {
        if (blocks[key].getAttribute('var') === name) {
          el = blocks[key];
          if (!isNotUpdate && !this.cache[name]) {
            this.cache[name] = {
              block: this.getContent(blocks[key]),
              condition: condition,
            };
          }
        }
      });

      if (!this.cache[name]) {
        return this;
      }

      el.innerHTML = condition ? this.cache[name].block : '';

      return this;
    }

    each(count_parse_element) {
      let string = this.tpl.innerHTML;
      for (let i = 0; i++ < count_parse_element - 1; string += this.tpl.innerHTML);
      this.tpl.innerHTML = string;

      return this;
    }

    parse(key, value) {
      let string = this.tpl.innerHTML;
      this.tpl.innerHTML = string.split("{" + key + "}").join(value);

      return this;
    }

    parseString(string, key, value) {
      return string.split("{" + key + "}").join(value);
    }
  }

  window.TPL_ = function(el) {
    return new TPL_(el);
  };

  window.D = {};

  D.xhr = function() {
    return ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;;
  };

  D.get = function(url) {
    return new Promise(function(success, reject){
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          success(xhr.responseText);
        }
      };
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };
      xhr.send(null);
    });
  };

  D.post = function(url, data) {
    return new Promise(function(success, reject){
      if (data) {
        reject(new Error("Second parameter not found"));
      }
      let xhr = new XMLHttpRequest();

      xhr.open("POST", url);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          success(xhr.responseText);
        }
      };

      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };

      let spl = data.split(",");
      let params = [];
      for (let i = 0; i < spl.length; i++) {
        let query = spl[i].split("=")[0];
        let value = spl[i].split("=")[1];
        params.push(query + "=" + encodeURIComponent(value));
      }

      xhr.send(params.join("&"));
    });
  };

  D.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

window.DooliObject = DooliObject;
window.TPLObject = TPL_;
}(window));

