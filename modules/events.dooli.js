module.exports = D.events = {
    events: {},

    onceCallbackCall: {},

    trigger: function(name, ...rest) {
        const callbacks = this._getListenersByEventName(name);
        callbacks.forEach((callback) => {
            callback(...rest);
        });

        (this.onceCallbackCall[name] || []).forEach((index) => {
            this._off(name, index);
        });

        this.onceCallbackCall[name] = [];
    },

    on: function(name, callback) {
        return this._register(name, callback);
    },

    once: function(ev, callback) {
        const index = this._register(ev, callback);
        if (this.onceCallbackCall[ev]) {
            this.onceCallbackCall[ev].push(index);
        } else {
            this.onceCallbackCall[ev] = [index];
        }
    },

    _getListenersByEventName: function(name) {
        return this.events[name];
    },

    _register: function(name, callback) {
        if (this.events[name]) {
            this.events[name].push(callback);
        } else {
            this.events[name] = [callback];
        }

        return this._getIndex(name);
    },

    _getIndex: function(name) {
        return (this.events[name]) ? this.events[name].length - 1 : null;
    },

    _off: function(ev, index) {
        const array = this.events[ev] || [];
        array.splice(index, 1);

        this.events[ev] = array;
    },
};
