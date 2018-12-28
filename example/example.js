const TPL = new TPL_();

TPL.init('main');
TPL.setIfBlock('test', false);

Dooli('button').click(() => {
    TPL.setIfBlock('test', true, true);
});

TPL.setIteration('iterateWrap', {
    data: [
        {
            name: 'Artem',
            age: 20,
        },
        {
            name: 'Anya',
            age: 24,
        },
        {
            name: 'Anya',
            age: 24,
        },
    ],
});


DooliObject.prototype.timer(86410, () => {
    console.warn('время вышло');
}, 1, (options) => {
    console.warn('прошло еще 1 секунда', options);
});
