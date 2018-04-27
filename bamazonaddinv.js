var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');


const mysql = require('mysql2');

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

conn.connect(
    function (err) {
        if (err) {
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
            
        }
    });

// * List a set of menu options: 1) View inventory for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product

//creates the prompt that will be loaded when the app loads
var managerOptions = {
	properties:{
		mOptions:{
			description: colors.blue('Key in one of the following options: 1) View inventory for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product')
		},
	},
};

//start the prompt
prompt.start();
//this prompts the above question and below it states what will be done based on what number the user types
prompt.get(managerOptions, function(err, res){
	if(res.mOptions == 1){
		viewinventory();
	} else if(res.mOptions == 2){
		viewInventory();
	} else if(res.mOptions == 3){
		addInventory();
	} else if(res.mOptions ==4){
		addNewProduct();
	} else {
		console.log('You picked an invalid choice.');
		connection.end();
	}
});

//this is the function for option 1 of the question above.
var viewinventory = function(){
	//connects to the mysql database called inventory and returns the information from that database
	conn.query('SELECT * FROM inventory', function(err, res){
		console.log('');
		console.log('inventory for Sale')
		console.log('');	

		//this creates a table outline in the node app to organize the data
		var table = new Table({
			head: ['id', 'name', 'DepartmentName', 'price', 'quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//this loops through the mysql connection and for each item that is returned, the information is then pushed to the table
		for(var i=0; i<res.length; i++){
			table.push(
				[res[i].id, res[i].name, res[i].DepartmentName, res[i].price, res[i].quantity]
			);
		}

		//this console.logs the table and then ends the mysql query connection
		console.log(table.toString());
		connection.end();
	})
};

//this creates the function for the second option from the prompt
var viewInventory = function(){

	//starts the connection to the mysql database inventory and only returns items that have a quantity of less than 5
	conn.query('SELECT * FROM inventory WHERE quantity < 5', function(err, res){
		console.log('');
		console.log('Items With Low Inventory');
		console.log('');

		var table = new Table({
			head: ['id', 'name', 'DepartmentName', 'price', 'quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//loops through the data returned from mysql and pushes it into the table to be logged on the console
		for(var i=0; i<res.length; i++){
			table.push(
				[res[i].id, res[i].name, res[i].DepartmentName, res[i].price, res[i].quantity]
			);
		}

		console.log(table.toString());
		connection.end();
	})
};

//creates the function for the third option of the prompt
var addInventory = function(){
	//this adds the variable that will prompt the information needed to replenish the quantity of a certain item from the product list
	var addInvt = {
		properties:{
			inventoryID: {
				description: colors.green('What is the ID number of the product you want to add inventory for?')
			},
			inventoryAmount:{
				description: colors.green('How many items do you want to add to the inventory?')
			}
		},
	};

	prompt.start();

	//get the information entered in response to the prompt above
	prompt.get(addInvt, function(err, res){

		//creates a variable for the answers to the prompt questions
		var invtAdded = {
			inventoryAmount: res.inventoryAmount,
			inventoryID: res.inventoryID,
		}

		//pushes the responses to the inventoryUpdate array created at the top of this page
		inventoryUpdate.push(invtAdded);

		//connect to the mysql database inventory and sets the stock quanitity to the number entered in the prompt above + the current quantity for a specific item iD
		connection.query("UPDATE inventory SET quantity = (quantity + ?) WHERE id = ?;", [inventoryUpdate[0].inventoryAmount, inventoryUpdate[0].inventoryID], function(err, result){

			if(err) console.log('error '+ err);

			//then this selects the newly updated information from the mysql database so we can console.log a confirmation to the user with the updated stock amount
			connection.query("SELECT * FROM inventory WHERE id = ?", inventoryUpdate[0].inventoryID, function(error, resOne){
				console.log('');
				console.log('The new updated quantity for id# '+inventoryUpdate[0].inventoryID+ ' is ' + resOne[0].quantity);
				console.log('');
				connection.end();
			})

		})
	})
};

//creates the function for the last option above
var addNewProduct = function(){
	//creates the variable newProduct which contains the questions that are to be prompted to the user
	var newProduct = {
		properties: {
			newIdNum:{ description: colors.gray('Please enter a unique 5 digit item Id #')},
			newItemName:{ description: colors.gray('Please enter the name of the product you wish to add')},
			newItemDepartment: { description: colors.gray('What department does this item belong in?')},
			newItemprice: { description: colors.gray('Please enter the price of the item in the format of 00.00')},
			newquantity: { description: colors.gray('Please enter a quantity for this item')},
		}
	}

	prompt.start();

	//gets the responses for the prompt above
	prompt.get(newProduct, function(err, res){

		//creates a variable for the responses to be logged to
		var newItem = {
			newIdNum: res.newIdNum,
			newItemName: res. newItemName,
			newItemDepartment: res.newItemDepartment,
			newItemprice: res.newItemprice,
			newquantity: res.newquantity,

		};

		//pushes the variable and the response data to the addedProduct array defined at the top of this page
		addedProduct.push(newItem);

		//connects to mysql and inserts the responses to the prompt into the mysql database to create a new product within the database
        conn.query('INSERT INTO inventory (id, name, price, quantity,DepartmentName) VALUES (?, ?, ?, ?, ?);', [addedProduct[0].newIdNum, addedProduct[0].newItemName, addedProduct[0].newItemDepartment, addedProduct[0].newItemprice, addedProduct[0].newquantity], function(err, result){

			if(err) console.log('Error: ' + err);

			console.log('New item successfully added to the inventory!');
			console.log(' ');
			console.log('id: ' + addedProduct[0].newIdNum);
			console.log('Item name: ' + addedProduct[0].newItemName);
			console.log('Department: ' + addedProduct[0].newItemDepartment);
			console.log('price: $' + addedProduct[0].newItemprice);
			console.log('quantity: ' + addedProduct[0].newquantity);

			connection.end();
		})
	})
};
