;(function(window){
  "use strict";

  window.Dooli = (selector, options = {}) => {
      return new DooliObject(selector, options);
  };

  class DooliObject {
    constructor(selector, options = {}) {
        if (typeof selector === 'object') {
            this.el = selector;
            return this;
        }

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
        if (arguments[0] || arguments[0] === '') {
            this.el.innerHTML = arguments[0];
        }

        return this.el.innerHTML;
    }

    css(...rest) {
        for (let i = 0; i < rest.length; i++) {
            let style_name = rest[i].toLowerCase().split(":")[0];
            let _style = rest[i].toLowerCase().split(":")[1];
            this.el.style[style_name] = _style;
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

        this.bindEvent('click', callback.bind(context));

        return this;
    }

    change(callback, context = this) {
        this.bindEvent('change', callback.bind(context));

        return this;
    }

    timer(timer, callback, triggerEventTimer, triggerEvent) {
        const now = Math.floor(Date.now() / 1000);
        const timeEnd = now + timer;
        const _timer = setInterval(() => {
            const time = Date.now() / 1000;
            if (Math.floor(time) >= timeEnd && typeof callback === 'function') {
                clearInterval(_timer);
                callback();
            }

            if (triggerEventTimer) {
                if (Math.floor(time % triggerEventTimer) === 0) {
                    if (typeof triggerEvent === 'function') {
                        timer--;
                        const func = () => {
                            const leftDays    = Math.floor(timer / 86400);
                            const leftHours   = Math.floor(timer / 3600);
                            const leftMinutes = Math.floor((timer / 60) % 60);
                            const leftSeconds = Math.floor(timer % 60);

                            return {
                                days: leftDays,
                                hours: leftHours,
                                minutes: leftMinutes,
                                seconds: leftSeconds,
                                timeEnd: timeEnd
                            };
                        };
                        const options = func();
                        triggerEvent(options);
                    }
                }
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
        keys.forEach((key) => this.bindEvent(key, items[key]));
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

    each(callback) {
        for (let i = 0; i < this.el.length; i++) {
            callback.call(Array.prototype, Dooli(this.el[i]), i, this.el);
        }
    }
  }

  class TPL {

    constructor() {
        this.cache = [];
    }

    init(selector) {
        this.tpl = Dooli(selector);
        if (this.tpl == null) {
            console.error(`Element with selector = ${selector} in DOM not found`);
            return this.tpl;
        }
    }

    setIteration(id, params = {}) {
        this.tpl = Dooli(id);
        const count = params.data ? params.data.length : 1;
        this.parse('count', count);

        if (params.data) {
            const data = params.data;
            let result = '';
            data.forEach((item) => {
                let string = this.tpl.html();
                const keys = Object.keys(item);
                keys.forEach((key) => {
                    string = this.parseString(string, key, item[key]);
                });
                result += string;
            });

            this.tpl.html(result);
        }
    }

    setIfBlock(name, condition, isNotUpdate = false) {
        const blocks = Dooli('dooli:if', { isTag: true });
        let el = null;
        blocks.each((key) => {
            if (key.get('var') === name) {
                el = key;
                if (!isNotUpdate && !this.cache[name]) {
                    this.cache[name] = {
                        block: key.html(),
                        condition: condition,
                    };
                }
            }
        });

        if (!this.cache[name]) {
            return this;
        }

        el.html(condition ? this.cache[name].block : '');

        return this;
    }

    each(count_parse_element) {
        let string = this.tpl.html();
        for (let i = 0; i++ < count_parse_element - 1; string += this.tpl.html());
        this.tpl.html(string);

        return this;
    }

    parse(key, value) {
        let string = this.tpl.html().split("{" + key + "}").join(value);
        this.tpl.html(string);

        return this;
    }

    parseString(string, key, value) {
        return string.split("{" + key + "}").join(value);
    }
  }

  window.D = {};

  D.xhr = ()=> {
      return ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;;
  };

  D.log = function() {
      const time_ = "[" + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds() + "]";
      const args = Array.prototype.slice.call(arguments);
      args.unshift(time_);
      console.log.apply(console, args);
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
  window.TPL = TPL;
}(window));

