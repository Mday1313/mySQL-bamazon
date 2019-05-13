var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "18_Acad1a_PRISM=28?",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("I'm connected");
});

var itemArr = [];
var amtOrdered = "";
var itemID = "";
var basketArr = [];
var newStock = "";
var totalItemPrice = "";

function updateProduct() {

  console.log("Order number " + itemID + " is in stock! There are " + newStock + " remaining.");
  connection.query('UPDATE products SET ? WHERE ?', [
    {
      stock_quantity: newStock
    },
    {
      id: itemID
    }
  ], function (error, results, fields) {
    if (error) throw error;
    inquirer.prompt([
      {
        type: "confirm",
        name: "checkout",
        message: "Would you like to continue to chekout? If NO, you can continue shopping."
      }
    ]).then(answers => {
      if (answers.checkout===true) {
        checkOut(itemID, amtOrdered);
      } else if (answers.checkout===false){
        mainFunction();
        return;
        
      }
    
  });
  }
  );
  
}

var checkOut = function () {
  console.log("You have ordered " + amtOrdered + " of item number " + itemID);
  // inquirer.prompt
  console.table(basketArr);
  connection.end();
}

var checkInventory = function () {
  // query that plugs in id num to pull out quantity
  connection.query('SELECT * FROM products WHERE id= ?', [itemID], function (error, results, fields) {
    if (error) throw error;
    var purchase = results[0];
      // If quantity is equal of > amt ordered and above 0, subtract from quantity and move on with order
    if (purchase.stock_quantity > amtOrdered) {
      newStock = purchase.stock_quantity - amtOrdered;
      totalItemPrice = purchase.price * amtOrdered;
      // push purchased item to basket
      
      basketArr.push(purchase.product_name + " " + amtOrdered + " " + purchase.price +  " " + totalItemPrice);
      // Update stock count by subtracting itemQuantity
      updateProduct(newStock, itemID, amtOrdered);
      // Prompt keep shopping or checkout
    } else {
      // Else log INSUFFICENT INVENTORY, return to shop All list
      console.log("INSUFFICIENT INVENTORY, please try back later.");
      // shopAll();
    }
  
  })
}

var shopAll = function () {

  connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    // console.log(results);
    for (var i = 0; i < results.length; i++) {
      var info = results[i];

      itemArr.push(info.id + "). " +
        info.product_name + "  " +
        chalk.red(" $" +
          info.price));
    }

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'item',
          message: "What would you like to purchase?",
          // paginated: true,
          choices: itemArr
        },
        {
          type: 'input',
          name: 'units',
          message: 'How many units would you like to purchase?'
        }
      ])
      .then(answers => {
        amtOrdered = answers.units;
        var itemPicked = answers.item.split(")");
        itemID = itemPicked[0];

        checkInventory(itemID, amtOrdered);
        return;
      });
  })
}

function shopByDepartment() {
  console.log("Work in progress");
}


function mainFunction() {
  console.log(chalk.blue("\n    Welcome to Bamazon\n"));

  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Shop all items', 'Shop by Department', 'EXIT']
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'Shop all items':
        shopAll();
        break;
      case 'Shop by Department':
        shopByDepartment();
        // prompt department list, them prompt items in that department
        break;

      case 'EXIT':

        return;
        break;
      default:
      // code block
    }

  });
}
mainFunction();




  // product_name, department_name, price, stock_quantity