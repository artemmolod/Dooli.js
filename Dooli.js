;(function(window){
  "use strict";

  window.Dooli = function(selector) {
    return new DooliObject(selector);
  }

  class DooliObject {
    constructor(selector) {
      this.el = document.getElementById(selector);
      if (this.el == null) {
        this.el = document.querySelectorAll(selector);
      }
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

    click() {
      this.el.click();
      return this;
    }

    attr(...rest) {
      for (var i = 0; i < rest.length; i++) {
        let attr_ = rest[i].toLowerCase().split("=")[0];
        let attr_val = rest[i].toLowerCase().split("=")[1];
        this.el.setAttribute(attr_, attr_val);
      }
      return this;
    }

    get(...rest) {
      if (rest.length == 1) {
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

  }

  class TPL {
    constructor(selector) {
      this.tpl = document.getElementById(selector);
      if (this.tpl == null) {
        console.error(`Element with id = ${selector} in DOM not found`);
        return 0;
        //this.tpl = document.querySelectorAll(selector);
      }
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
    }
  }

  window.TPL_ = function(el) {
    return new TPL(el);
  }

  window.D = {};

  D.xhr = function() {
    let x;
    try {
      x = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        x = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (E) {
        x = false;
      }
    }
    if (!x && typeof XMLHttpRequest != 'undefined') {
      x = new XMLHttpRequest();
    }
    return x;
  }  

  D.get = function(url) {
    return new Promise(function(success, reject){
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          success(xhr.responseText);
        }
      }
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      }
      xhr.send(null);  
    });
  }

  D.post = function(url, data) {
    return new Promise(function(success, reject){
      if (data) {
        reject(new Error("Second parameter not found"));
      } 
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          success(xhr.responseText);
        }
      }
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      }
      let spl = data.split(",");
      let params = [];
      for (let i = 0; i < spl.length; i++) {
        let query = spl[i].split("=")[0];
        let value = spl[i].split("=")[1];
        params.push(query + "=" + encodeURIComponent(value));
      }
      console.log(params);
      xhr.send(params.join("&"));  
    });
  }

  D.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

window.DooliObject = DooliObject;
}(window))