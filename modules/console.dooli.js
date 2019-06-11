D.console = {};

D.console.log = (...rest) => {
    rest.unshift(D.getTimeConsoleFormat());
    console.log.apply(console, rest);
};

D.console.warn = (...rest) => {
    rest.unshift(D.getTimeConsoleFormat());
    console.warn.apply(console, rest);
};

D.console.err = (...rest) => {
    rest.unshift(D.getTimeConsoleFormat());
    console.error.apply(console, rest);
};

module.exports = D.console;
