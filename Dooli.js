(function(window){
    "use strict";

    window.Dooli = window.Di = (selector, options = {}) => {
        return new DooliAbstract(selector, options);
    };

    class DooliAbstract {
        /**
         * @constructor
         * @param selector
         * @param options
         * @returns {DooliAbstract}
         */
        constructor(selector, options = {}) {
            if (selector && selector.includes && selector.includes('dooli:')) {
                this.el = document.getElementsByTagName(selector);
            } else if (typeof selector === 'object') {
                this.el = selector;
            } else {
                this.el = document.querySelectorAll(selector);
                if (this.el.length === 1) {
                    this.el = this.el[0];
                }
            }

            return this;
        }

        /**
         * Создает новый элемент по правилам
         * @param {object}  options
         * @param {string}  options.tag - тег нового элемента
         * @param {number}  options.id - id нового элемента
         * @param {string}  options.classes - css классы через запятую
         * @param {string}  options.html - содержимое элемента
         * @param {object}  options.events - слушаемые событие, пример, events: { click: () => {} }
         * @param {object}  options.wrap - куда вставить элемент
         * @param {object}  options.wrap.node - родительский элемент
         * @param {boolean} options.wrap.isBefore - флаг, если вставлять в начало родителя
         *
         * @returns {DooliAbstract}
         */
        create(options) {
            this.el = document.createElement(options.tag);

            if (options.classes) this.addClass(...options.classes.split(','));
            if (options.id)      this.attr(`id=${options.id}`);
            if (options.html)    this.html(options.html);
            if (options.events)  this.bindMultiple(options.events);
            if (options.wrap)    this._addElementToParentNode(options.wrap);

            return this;
        }

        /**
         * Добавляет элемент в узел
         * @param options
         * @private
         */
        _addElementToParentNode(options) {
            if (options.isBefore) {
                options.node.insertBefore(this.el, options.node.firstChild);
            } else {
                options.node.appendChild(this.el);
            }
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
         * @returns {DooliAbstract}
         */
        first() {
            this.el = this.el[0];

            return this;
        }

        /**
         * Возвращает nodes по аттрибутам, не знаю зачем, так как Dooli(...) сделает тоже самое
         * @param {string} attr - пример, [data-type='type']
         * @param {boolean} flag - если true, то вернет коллекцию, иначе контекст
         * @returns {DooliAbstract}
         */
        getNodesByAttr(attr, flag) {
            this.el = document.querySelectorAll(attr);

            return flag ? document.querySelectorAll(attr) : this;
        }

        /**
         * Возвращает node элемент по его номеру из коллекции
         * @param {number} i - порядковый номер
         * @returns {DooliAbstract}
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

        val(value) {
            if (value && value.length) {
                this.el.value = value;
            }

            return this.el.value;
        }

        valLength() {
            return this.val().length;
        }

        /**
         * Применяет css стили к элементу
         * @param rest - "color: #F00", "font-size: 23px"
         * @returns {DooliAbstract}
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
         * @returns {DooliAbstract}
         */
        addClass(...rest) {
            for (let i = 0; i++ < rest.length; this.el.classList.add(rest[i - 1]));

            return this;
        }

        /**
         * Удаляет css классы, пример "test", "test-new-dooli"
         * @param rest
         * @returns {DooliAbstract}
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
         * @returns {DooliAbstract}
         */
        focus() {
            this.el.focus();

            return this;
        }

        /**
         * Устанавливает различные аттрибуты, например, "data-type=0", "data-start=hi!"
         * @param rest
         * @returns {DooliAbstract}
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
         * @returns {DooliAbstract}
         */
        hide() {
            this.css("display:none");

            return this;
        }

        /**
         * Добавляет display: block
         * @returns {DooliAbstract}
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

            return this;
        }

        /**
         * Обработчик клика на элемент
         * @param callback - коллбек при клике
         * @param context - контекст для коллбека
         * @returns {DooliAbstract}
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
         * @returns {DooliAbstract}
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

        animate(options) {
            const start = performance.now();

            requestAnimationFrame(function animate(time) {
                let timeFraction = (time - start) / options.duration;
                if (timeFraction > 1) timeFraction = 1;

                const progress = options.timing(timeFraction);

                options.draw(progress);

                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                }
            });
        }

        findParent(cssClass) {
            let el = this.el;
            while (!el.classList.contains(cssClass)) {
                el = el.parentNode;
                if (!el.classList) {
                    break;
                }
            }

            return el;
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

    D.get = (url, headers) => {
        return new Promise((success, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    success(xhr.responseText);
                }
            };

            if (headers) {
                Object.keys(headers).forEach((header) => {
                    xhr.setRequestHeader(header, headers[header]);
                });
            }

            xhr.onerror = function() {
                reject(new Error("Network Error"));
            };

            xhr.send(null);
        });
    };

    D.post = (url, data, headers) => {
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

            if (headers) {
                Object.keys(headers).forEach((header) => {
                    xhr.setRequestHeader(header, headers[header]);
                });
            }

            let params = [];
            const keys = Object.keys(data);
            keys.forEach((key) => {
                params.push(`${key}=${encodeURIComponent(data[key])}`);
            });

            xhr.send(params.join("&"));
        });
    };

    D.animate = {};
    D.animate.quad = (fraction) => Math.pow(fraction, 2);
    D.animate.arc  = (fraction) => 1 - Math.sin(Math.acos(fraction));
    D.animate.back = (x, fraction) => Math.pow(fraction, 2) * ((x + 1) * fraction - x);
    D.animate.bounce = (fraction) => {
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
            if (fraction >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * fraction) / 4, 2) + Math.pow(b, 2);
            }
        }
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
                            let days        = Math.floor(timer / 86400);
                            let hoursLeft   = Math.floor((timer) - (days * 86400));
                            let hours       = Math.floor(hoursLeft / 3600);
                            let minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                            let minutes     = Math.floor(minutesLeft / 60);
                            let seconds     = Math.floor(timer % 60);

                            if (days < 10)    days = `0${days}`;
                            if (hours < 10)   hours = `0${hours}`;
                            if (minutes < 10) minutes = `0${minutes}`;
                            if (seconds < 10) seconds = `0${seconds}`;

                            return {
                                days: days,
                                hours: hours,
                                minutes: minutes,
                                seconds: seconds,
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

    window.DooliAbstract = DooliAbstract;
    window.TPL = TPL;
}(window));

