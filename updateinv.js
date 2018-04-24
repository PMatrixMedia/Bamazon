// JavaScript source code
'use strict'
var inquirer = require('inquirer')

var questions = [
    {
        type: 'input',
        name: 'id',
        message: 'What Item would you like to update?',
        validate: function (value) {
            var pass = value.match(
                /[1-9][0-9]*|0/
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid id number';

    }   },
    {
        type: 'input',
        name: 'quantity',
        message: 'how many would you like to add?',
        validate: function (value) {
            var qt = value.match(
                /[1-9][0-9]*|0/
            );
            if (qt) {
                return true;
            }
            return 'Please enter a valid quantity.';
        }
    }
];


inquirer.prompt(questions).then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
});

