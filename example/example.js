const TPL = new TPL_();

TPL.init('main');
TPL.setIfBlock('test', false);

Dooli('button').click(() => {
    TPL.setIfBlock('test', true, true);
});

Dooli().timer(3, () => {
    Dooli('button').click();
});


Dooli('main').css('color:red;background-color:#000;');
