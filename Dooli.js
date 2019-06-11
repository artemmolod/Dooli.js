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

    window.D = {};

    D.getTimeConsoleFormat = () => {
        return "[" + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds() + "]";
    };

    window.DooliAbstract = DooliAbstract;
}(global));

