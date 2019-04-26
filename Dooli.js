(function(window){
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

            if (selector === document) {
                this.el = document;
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
         * Возвращает true/false если элемент содержит один или несколько нужных css классов
         * Последним аргументом передаем:
         * true - если все классы содержит
         * false - один класс содержит (по умолчанию)
         * @param rest
         */
        hasClass(...rest) {
            let flag = rest.pop();
            const isBool = Object.prototype.toString.call(flag) === '[object Boolean]';

            if (!isBool) flag = false;

            const callback = (item) => this.el.classList.contains(item);

            return flag ? rest.every(callback) : rest.some(callback);
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
         * Событие ховера на элементе
         * @param {function} mouseenter - курсор в пределах элемента
         * @param {function} mouseleave - курсор за пределами элемента
         */
        hover(mouseenter, mouseleave) {
            this.bindMultiple({
                mouseenter: mouseenter,
                mouseleave: mouseleave,
            });
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
         * @param items - {object}. Пример, { click: () => { alert() }, mousemove: () => {} }
         * @param context
         */
        bindMultiple(items, context) {
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

    D.xhr = () => {
        return ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;;
    };

    D.getTimeConsoleFormat = () => {
        return "[" + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds() + "]";
    };

    D.console = {};
    D.console.log  = () => D.warn('Please use D.log');
    D.console.warn = () => D.warn('Please use D.warn');
    D.console.err  = () => D.warn('Please use D.err');

    D.log = (...rest) => {
        rest.unshift(D.getTimeConsoleFormat());
        console.log.apply(console, rest);
    };

    D.warn = (...rest) => {
        rest.unshift(D.getTimeConsoleFormat());
        console.warn.apply(console, rest);
    };

    D.err = (...rest) => {
        rest.unshift(D.getTimeConsoleFormat());
        console.error.apply(console, rest);
    };

    D.get = (url) => {
        return new Promise((success, reject) => {
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

    D.post = (url, data) => {
        return new Promise((success, reject) => {
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

    D.utils = {};
    D.utils.getType = (ctx) => Object.prototype.toString.call(ctx);

    D.math = {};
    D.math.rand = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    D.time = {};
    D.time.getTime = (timestamp) => Math.floor(+new Date() / 1000) + (timestamp || 0);
    D.time.getRelativeDate = (timestamp) => {
        timestamp = timestamp * 1000;
        const DateObject = new Date(timestamp);
        const date = DateObject.toISOString().replace(/^([^T]+)T(.+)$/,'$1').replace(/^(\d+)-(\d+)-(\d+)$/,'$3.$2.$1');

        return date;
    };
    D.time.getTimestamp = (date) => Math.floor((new Date(date)).getTime() / 1000);
    D.time.timer = (timer, callback, triggerEventTimer, triggerEvent) => {
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
                            let leftDays    = Math.floor(timer / 86400);
                            let leftHours   = Math.floor(timer / 3600);
                            let leftMinutes = Math.floor((timer / 60) % 60);
                            let leftSeconds = Math.floor(timer % 60);

                            if (leftDays < 10)    leftDays = `0${leftDays}`;
                            if (leftHours < 10)   leftHours = `0${leftHours}`;
                            if (leftMinutes < 10) leftMinutes = `0${leftMinutes}`;
                            if (leftSeconds < 10) leftSeconds = `0${leftSeconds}`;

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
    };

    D.touch = {};
    D.touch.SENSITIVITY_X = 160;
    D.touch.SENSITIVITY_Y = 160;
    D.touch.callbacks = {
        callbackTouchTop:    () => console.log('Верхний тач'),
        callbackTouchLeft:   () => console.log('Левый тач'),
        callbackTouchBottom: () => console.log('Нижний тач'),
        callbackTouchRight:  () => console.log('Правый тач'),
    };
    D.touch.isEnabledTouchEvent = () => !!('ontouchstart' in window);
    D.touch.onStart = function(event) {
        event  = event || window.event;
        D.touch.startPoint = event.changedTouches[0];
    };
    D.touch.onEnded = function(event) {
        event  = event || window.event;
        D.touch.endPoint = event.changedTouches[0];
        const coordsX = Math.abs(D.touch.startPoint.pageX - D.touch.endPoint.pageX);
        const coordsY = Math.abs(D.touch.startPoint.pageY - D.touch.endPoint.pageY);

        if (coordsX > D.touch.SENSITIVITY_X || coordsY > D.touch.SENSITIVITY_Y) {
            if (coordsX > coordsY) {
                if (D.touch.endPoint.pageX < D.touch.startPoint.pageX) {
                    if (typeof D.touch.callbacks.callbackTouchLeft === 'function') {
                        D.touch.callbacks.callbackTouchLeft();
                    }
                } else {
                    if (typeof D.touch.callbacks.callbackTouchRight === 'function') {
                        D.touch.callbacks.callbackTouchRight();
                    }
                }
            } else {
                if (D.touch.endPoint.pageY < D.touch.startPoint.pageY) {
                    if (typeof D.touch.callbacks.callbackTouchBottom === 'function') {
                        D.touch.callbacks.callbackTouchBottom();
                    }
                } else {
                    if (typeof D.touch.callbacks.callbackTouchTop === 'function') {
                        D.touch.callbacks.callbackTouchTop();
                    }
                }
            }
        }
    };

    Dooli(document).bindMultiple({
        touchstart: D.touch.onStart.bind(this),
        touchend: D.touch.onEnded.bind(this),
    });

    window.DooliObject = DooliObject;
    window.TPL = TPL;
}(window));

