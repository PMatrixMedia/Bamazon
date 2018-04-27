// JavaScript source code
const mysql = require('mysql2');
var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');


var config =
    {
        host: 'webapp-mysqldbserver-abfbb289-34681.mysql.database.azure.com',
        user: 'pmatrixmedia@webapp-mysqldbserver-abfbb289-34681',
        password: 'N@mkc0r1',
        database: 'bamazon',
        port: 3306,
        ssl: true
    };

const conn = new mysql.createConnection(config);



var productPurchased = [];



//connect to the mysql database and pull the information from the Inventory database to display to the user
conn.query('SELECT id, name, price FROM Inventory', function (err, result) {
    if (err) console.log(err);

    //creates a table for the information from the mysql database to be placed
    var table = new Table({
        head: ['Item Id#', 'name', 'price'],
        style: {
            head: ['red'],
            compact: false,
            colAligns: ['center'],
        }
    });

    //loops through each item in the mysql database and pushes that information into a new row in the table
    for (var i = 0; i < result.length; i++) {
        table.push(
            [result[i].id, result[i].name, result[i].price]
        );
    }
    console.log(table.toString());

    purchase();
});

//the purchase function so the user can purchase one of the items listed above
var purchase = function () {

    //creates the questions that will be prompted to the user
    var productInfo = {
        properties: {
            id: { description: colors.red('Please enter the ID # of the item you wish to purchase!') },
            quantity: { description: colors.green('How many items would you like to purchase?') }
        },
    };

    prompt.start();

    //gets the responses to the prompts above
    prompt.get(productInfo, function (err, res) {

        //places these responses in the variable custPurchase
        var custPurchase = {
            id: res.id,
            quantity: res.quantity
        };

        //the variable established above is pushed to the productPurchased array defined at the top of the page
        productPurchased.push(custPurchase);

        //connects to the mysql database and selects the item the user selected above based on the item id number entered
        conn.query('SELECT * FROM Inventory WHERE id=?', productPurchased[0].id, function (err, res) {
            if (err) console.log(err, 'That item ID doesn\'t exist');

            //if the stock quantity available is less than the amount that the user wanted to purchase then the user will be alerted that the product is out of stock
            if (res[0].quantity < productPurchased[0].quantity) {
                console.log('That product is out of stock!');
                conn.end();

                //otherwise if the stock amount available is more than or equal to the amount being asked for then the purchase is continued and the user is alerted of what items are being purchased, how much one item is and what the total amount is
            } else if (res[0].quantity >= productPurchased[0].quantity) {

                console.log('');

                console.log(productPurchased[0].quantity + ' items purchased');

                console.log(res[0].name + ' ' + res[0].price);

                //this creates the variable SaleTotal that contains the total amount the user is paying for this total puchase
                var saleTotal = res[0].price * productPurchased[0].quantity;

                //connect to the mysql database Departments and updates the saleTotal for the id of the item purchased
                conn.query("UPDATE inventory SET TotalSales = ? WHERE DepartmentName = ?;", [saleTotal, res[0].DepartmentName], function (err, resultOne) {
                    if (err) console.log('error: ' + err);
                    return resultOne;
                })

                console.log('Total: ' + saleTotal);

                //this variable contains the newly updated stock quantity of the item purchased
                newquantity = res[0].quantity - productPurchased[0].quantity;

                // connects to the mysql database Inventory and updates the stock quantity for the item puchased
                conn.query("UPDATE Inventory SET quantity = " + newquantity + " WHERE id = " + productPurchased[0].id, function (err, res) {
                    // if(err) throw err;
                    // console.log('Problem ', err);
                    console.log('');
                    console.log(colors.cyan('Your order has been processed.  Thank you for shopping with us!'));
                    console.log('');

                    conn.end();
                })

            };

        })
    })

};

