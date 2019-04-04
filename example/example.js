const Template = new TPL();

Template.setIfBlock('test', false);
Template.setIfBlock('var', false);

Dooli('button').click(() => {
    Template.setIfBlock('test', true, true);
});

Template.setIteration('iterateWrap', {
    data: [
        {
            name: 'Artem',
            age: 20,
        },
        {
            name: 'Anya',
            age: 24,
        },
    ],
});

Dooli('second_button').click(() => {
    Template.setIfBlock('var', true, true);
});
