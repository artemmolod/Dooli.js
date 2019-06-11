const utils = {};
utils.getType = (ctx) => Object.prototype.toString.call(ctx);

module.exports = utils;
