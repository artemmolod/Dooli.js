const animate = {};
animate.quad = (fraction) => Math.pow(fraction, 2);
animate.arc  = (fraction) => 1 - Math.sin(Math.acos(fraction));
animate.back = (x, fraction) => Math.pow(fraction, 2) * ((x + 1) * fraction - x);
animate.bounce = (fraction) => {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
        if (fraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * fraction) / 4, 2) + Math.pow(b, 2);
        }
    }
};

module.exports = animate;
