const console = {};

console.log = (...rest) => {
    rest.unshift(D.getTimeConsoleFormat());
    console.log.apply(console, rest);
};

console.warn = (...rest) => {
    rest.unshift(D.getTimeConsoleFormat());
    console.warn.apply(console, rest);
};

console.err = (...rest) => {
    rest.unshift(D.getTimeConsoleFormat());
    console.error.apply(console, rest);
};

export default console;
