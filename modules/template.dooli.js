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

module.exports = TPL;
