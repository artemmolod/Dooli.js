;(function(window){
    "use strict";

    window.Dooli = (selector, options = {}) => {
        return new DooliObject(selector, options);
    };

    class DooliObject {
        /**
         * @constructor
         * @param selector
         * @param options
         * @returns {DooliObject}
         */
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

        /**
         * Возвращает node, коллекцию nodes или null
         * @returns {*}
         */
        obj() {
            return this.el;
        }

        /**
         * Возвращает первый node из коллекции
         * @returns {DooliObject}
         */
        first() {
            this.el = this.el[0];

            return this;
        }

        /**
         * Возвращает nodes по аттрибутам, не знаю зачем, так как Dooli(...) сделает тоже самое
         * @param {string} attr - пример, [data-type='type']
         * @param {boolean} flag - если true, то вернет коллекцию, иначе контекст
         * @returns {DooliObject}
         */
        getNodesByAttr(attr, flag) {
            this.el = document.querySelectorAll(attr);

            return flag ? document.querySelectorAll(attr) : this;
        }

        /**
         * Возвращает node элемент по его номеру из коллекции
         * @param {number} i - порядковый номер
         * @returns {DooliObject}
         */
        num(i) {
            if (i >= this.el.length) i = 0;
            this.el = this.el[i];

            return this;
        }

        /**
         * Возврашает содержимое node контейнера
         * @returns {*|string}
         */
        html() {
            if (arguments[0] || arguments[0] === '') {
                this.el.innerHTML = arguments[0];
            }

            return this.el.innerHTML;
        }

        /**
         * Применяет css стили к элементу
         * @param rest - "color: #F00", "font-size: 23px"
         * @returns {DooliObject}
         */
        css(...rest) {
            for (let i = 0; i < rest.length; i++) {
                let style_name = rest[i].toLowerCase().split(":")[0];
                let _style = rest[i].toLowerCase().split(":")[1];
                this.el.style[style_name] = _style;
            }

            return this;
        }

        /**
         * Добавляет css классы, пример "test", "test-new-dooli"
         * @param rest
         * @returns {DooliObject}
         */
        addClass(...rest) {
            for (let i = 0; i++ < rest.length; this.el.classList.add(rest[i - 1]));

            return this;
        }

        /**
         * Удаляет css классы, пример "test", "test-new-dooli"
         * @param rest
         * @returns {DooliObject}
         */
        removeClass(...rest) {
            for (let i = 0; i++ < rest.length; this.el.classList.remove(rest[i - 1]));

            return this;
        }

        /**
         * Клонирует node элемент
         * @returns {ActiveX.IXMLDOMNode | Node}
         */
        clone() {
            return this.el.cloneNode(true);
        }

        /**
         * Навешивает фокус
         * @returns {DooliObject}
         */
        focus() {
            this.el.focus();

            return this;
        }

        /**
         * Устанавливает различные аттрибуты, например, "data-type=0", "data-start=hi!"
         * @param rest
         * @returns {DooliObject}
         */
        attr(...rest) {
            for (let i = 0; i < rest.length; i++) {
                let attr_ = rest[i].toLowerCase().split("=")[0];
                let attr_val = rest[i].toLowerCase().split("=")[1];
                this.el.setAttribute(attr_, attr_val);
            }

            return this;
        }

        /**
         * Возвращает значение аттрибута или массив значений
         * @param rest
         * @returns {*}
         */
        get(...rest) {
            if (rest.length === 1) {
                return this.el.getAttribute(rest[0]);
            } else {
                for (var i = 0, arr = []; i++ < rest.length; arr.push(this.el.getAttribute(rest[i - 1])));
                return arr;
            }
        }

        /**
         * Вставляет несколько node узлов в конец
         * @param rest
         */
        append(...rest) {
            for (let i = 0; i < rest.length; i++) {
                this.el.appendChild(rest[i]);
            }
        }

        /**
         * Вставляет несколько node узлов в начало
         * @param rest
         */
        prepend(...rest) {
            for (let i = 0; i < rest.length; i++) {
                this.el.insertBefore(rest[i], this.el.firstChild);
            }
        }

        /**
         * Возвращает массив размером width, height
         * @returns {*[]}
         */
        size() {
            return [this.el.offsetWidth, this.el.offsetHeight];
        }

        /**
         * Возвращает offsetWidth
         * @returns {*}
         */
        width() {
            return this.size()[0];
        }

        /**
         * Возвращает offsetHeight
         * @returns {*}
         */
        height() {
            return this.size()[1];
        }

        /**
         * Добавляет display: none
         * @returns {DooliObject}
         */
        hide() {
            this.css("display:none");

            return this;
        }

        /**
         * Добавляет display: block
         * @returns {DooliObject}
         */
        show() {
            this.css("display: block");

            return this;
        }

        /**
         * Обработчик клика на элемент
         * @param callback - коллбек при клике
         * @param context - контекст для коллбека
         * @returns {DooliObject}
         */
        click(callback, context = this) {
            const args = Array.prototype.slice.call(arguments);
            if (!args.length) {
                this.el.click();
                return this;
            }

            this.bindEvent('click', callback.bind(context));

            return this;
        }

        /**
         * Обработчик события для элемента
         * @param callback - коллбек при клике
         * @param context - контекст для коллбека
         * @returns {DooliObject}
         */
        change(callback, context = this) {
            this.bindEvent('change', callback.bind(context));

            return this;
        }

        /**
         * Таймер
         * @param timer - время в секундах
         * @param callback - коллбек при завершении таймера
         * @param triggerEventTimer - флаг триггера, чтобы вызвать triggerEvent каждую сек
         * @param triggerEvent - коллбек для триггера, срабатывает каждую сек
         * @returns {object} - с полями days, hours, minutes, seconds, timeEnd
         */
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

        /**
         * Навешивает коллбек на событие, удаляю такие же текущие
         * @param event - событие, пример, click, change, mousemove ...
         * @param callback - callback
         * @param ctx - context для коллбека
         */
        bindEvent(event, callback, ctx) {
            this.removeEvent(event, callback, ctx);
            this.addEvent(event, callback, ctx);
        }

        /**
         * Навешивает несколько коллбеков на события
         * @param el - элемент, которые слушаем
         * @param items - {object}. Пример, { click: () => { alert() }, mousemove: () => {} }
         * @param context
         */
        bindMylty(el, items, context) {
            const keys = Object.keys(items);
            keys.forEach((key) => this.bindEvent(key, items[key], context));
        }

        /**
         * Добавляем коллбек на событие
         * @param event
         * @param callback
         * @param ctx
         */
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

            if (!el) {
                const nodes = Dooli().getNodesByAttr(`[dooli-if-var="${name}"]`);
                nodes.each((node) => {
                    el = node;
                    if (!isNotUpdate && !this.cache[name]) {
                        this.cache[name] = {
                            block: node.html(),
                            condition: condition,
                        };
                    }
                });
            }

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
            let xhr = new XMLHttpRequest();

            xhr.open("POST", url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    return success(xhr.responseText);
                }
            };

            xhr.onerror = function() {
                reject(new Error("Network Error"));
            };

            let params = [];
            const keys = Object.keys(data);
            keys.forEach((key) => {
                params.push(`${key}=${encodeURIComponent(data[key])}`);
            });

            xhr.send(params.join("&"));
        });
    };

    D.rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    window.DooliObject = DooliObject;
    window.TPL = TPL;
}(window));

