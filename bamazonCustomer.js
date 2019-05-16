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
var departArr = [];
var amtOrdered = "";
var itemID = "";
var basketArr = [];
var newStock = "";
var totalItemPrice = [];

function updateProduct() {

  console.log("\nYour order is in stock! There are " + newStock + " remaining.\n");
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
        message: "Would you like to continue to chekout? If NO, you may continue shopping."
      }
    ]).then(answers => {
      if (answers.checkout === true) {
        checkOut(itemID, amtOrdered);
      } else if (answers.checkout === false) {
        mainFunction();
        return;
      }
    });
  }
  );
}

var checkOut = function () {

  console.log("\n               Your Order                ");
  console.log("\n=====================================\n");

  for (i = 0; i < basketArr.length; i++) {
    console.log(basketArr[i]);
  }
  console.log("\n------------------------------------------\n");
  var reducer = (accumulator, currentValue) => accumulator + currentValue
  console.log("Your total is: " +  chalk.red("$" +totalItemPrice.reduce(reducer)));

  console.log("\n                              ");
  console.log("\n=====================================\n");
  console.log("      THANK YOU FOR YOU PURCHASE!");
  console.log("\n=====================================\n");

  connection.end();
}

var checkInventory = function () {
  // query that plugs in id num to pull out quantity
  connection.query('SELECT * FROM products WHERE id= ?', [itemID], function (error, results, fields) {
    if (error) throw error;
    var purchase = results[0];
    // If quantity is equal of > amt ordered and above 0, subtract from quantity and move on with order
    if (purchase.stock_quantity >= amtOrdered) {
      newStock = purchase.stock_quantity - amtOrdered;
      totalItemPrice.push(purchase.price * amtOrdered);
      // push purchased item to basket

      basketArr.push(purchase.product_name + " ||  " + amtOrdered + " units" + " ||  " + chalk.red("$ " + purchase.price * amtOrdered));
      // Update stock count by subtracting itemQuantity
      updateProduct(newStock, itemID, amtOrdered);
      // Prompt keep shopping or checkout
    } else if (purchase.stock_quantity < amtOrdered) {

      console.log(chalk.red("\nINSUFFICIENT INVENTORY, please try back later."));
      mainFunction();
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
         
          choices: itemArr
        },
        {
          type: 'input',
          name: 'units',
          message: 'How many units would you like to purchase?',
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false
          }
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
  console.log("\n Work in progress\n");
  
}

console.log(chalk.blue("\n    Welcome to Bamazon\n"));
function mainFunction() {
  console.log("\n");

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
        // prompt department list, then prompt items in that department
        break;

      case 'EXIT':
        connection.end();
        return;
        break;
    }

  });
}
mainFunction();
