// JavaScript source code
var inquirer = require('inquirer');

inquirer.prompt([{
    type: 'list',
    name: 'Intialize',
    message: 'Would you like to View Inventory or Buy an Item?',
    choices: ['View Inventory', 'Buy an Item',]
},
]).then(function (answers) {
    if (answers.Intialize === 'View Inventory') {
        inquirer.prompt([{
            type: 'input',
            name: 'Itemlist',
            message: 'Here is a list of the Items we have for sale.'
        },
        {
            type: 'input',
            name: 'BuyItem',
            message: 'What item would you like to buy?'
        },
        ]).then(function (answers) {
            console.log(answers.Itemlist, answers.BuyItem)
        })
    }
    if (answers.Intialize === 'Buy an Item') {
        console.log('What item would you like to buy?')
    }
});