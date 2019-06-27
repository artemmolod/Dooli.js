D.storage = {};

D.storage.local = {};

D.storage.local.set = function(key, value, options = {}) {
    if (D.storage.local.isLock(key)) {
        D.console.warn('Key has been locked');
        return;
    }

    if (utils.getType(value) !== '[object Object]') {
        const params = {};
        params._dooli_value = value;
        value = params;
    }

    const settings = {};
    if (options.expires) {
        settings.expires = time.getTime(options.expires);
    }

    if (options.isLock) {
        settings.isLock = true;
    }

    value._dooli_options = settings;

    localStorage.setItem(key, JSON.stringify(value));
};

D.storage.local.get = function(key) {
    const object = JSON.parse(localStorage.getItem(key));
    if (!object) {
        return null;
    }

    const expires = object._dooli_options.expires;
    if (expires && expires < time.getTime()) {
        localStorage.removeItem(key);
        return null;
    }

    const value = object._dooli_value || object;

    if (value['_dooli_options']) {
        delete value['_dooli_options'];
    }

    if (value['_dooli_value']) {
        delete value['_dooli_value']
    }

    return value;
};

D.storage.local.isLock = function(key) {
    const object = JSON.parse(localStorage.getItem(key));
    if (!object) {
        return false;
    }

    return object._dooli_options.isLock;
};

D.storage.local.setLock = function(key, isLock) {
    const object = JSON.parse(localStorage.getItem(key));
    if (!object) {
        return D.console.warn('Key not found');
    }

    object['_dooli_options']['isLock'] = isLock;

    localStorage.setItem(key, JSON.stringify(object));
};

D.storage.local.remove = function(key) {
    if (D.storage.local.isLock(key)) {
        return D.console.warn('Key has been locked');
    }

    localStorage.removeItem(key);
};

D.storage.local.getSize = function() {
    let size;
    let totalSize = 0;
    for (let key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) {
            continue;
        }

        size = localStorage[key].length * 2 + key.length * 2;
        totalSize += size;
    }

    return totalSize;
};

module.exports = D.storage;
