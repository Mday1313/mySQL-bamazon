var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var Table = require('easy-table')

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

//   Variables 
var data = [];
itemArr = [];
var t = "";
var amtOrdered = "";
var itemID = "";
var newStock = "";

function printTable() {

    t = new Table

    data.forEach(function (product) {
        t.cell('Product Id', product.id)
        t.cell('Description', product.desc)
        t.cell('Quantity', product.quantity)
        t.cell('Price, USD', product.price, Table.number(2))
        t.newRow()
    })

    console.log(t.toString());
    console.log();
    console.log("__________________________________________\n");
    mainFunction();
}

function allProducts() {
    data = [];

    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        console.log();
        for (var i = 0; i < results.length; i++) {
            var info = results[i];

            data.push({ id: info.id, desc: info.product_name, quantity: info.stock_quantity, price: info.price });
        }
        console.log(" _______________");
        console.log();
        console.log("| All Inventory |");
        console.log(" _______________\n");
        printTable();

    })

}

function lowInventory() {
    data = [];

    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        console.log();
        for (var i = 0; i < results.length; i++) {
            var info = results[i];
            if (info.stock_quantity < 5) {
                data.push({ id: info.id, desc: info.product_name, quantity: info.stock_quantity, price: info.price });
            }
        }
        console.log(" _______________");
        console.log();
        console.log("| Low Inventory |");
        console.log(" _______________\n");
        printTable();
    })

}

function updateDatabase() {
    
    
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
        name: "addMore",
        message: "Would you like to add inventory to another item?"
      }
    ]).then(answers => {
      if (answers.addMore === true) {
        addToInventory();
      } else if (answers.addMore === false) {
        allProducts();
        return;
      }
    });
  }
  );
}

function updateStock(){
connection.query('SELECT * FROM products WHERE id= ?', [itemID], function (error, results, fields) {
    if (error) throw error;
    var purchase = results[0];
     var current = parseInt(purchase.stock_quantity);
      newStock = current + parseInt(amtOrdered);
     
      updateDatabase(newStock, itemID, amtOrdered);
   
  })
}

function addToInventory() {
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
            message: "What would you like to update?",
           
            choices: itemArr
          },
          {
            type: 'input',
            name: 'units',
            message: 'How many units would you like to add?',
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
          
          updateStock(itemID, amtOrdered);
          return;
        });
    })
}

function newProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "What is the name of the product you are adding?"
        },
        {
            type: "input",
            name: "department",
            message: "What is the name of the department you are adding this product to?"
        },
        {
            type: "input",
            name: "price",
            message: "How much does this item cost per unit?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units are you adding to the inventory?",
            validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false
          }
        }
      ])
      .then(answers => {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: answers.product,
              department_name: answers.department,
              price: answers.price,
              stock_quantity: answers.quantity
            },
            function(err, res) {           
              allProducts();
            }
          );

        
      });
      return;
}

console.log("\nWelcome to Bamazon Manager Console\n");

function mainFunction() {

    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Which action would you like to perform?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
        }
    ]).then(answers => {

        switch (answers.action) {
            case "View Products for Sale":
                allProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "EXIT":
                console.log("\nExiting the Program!");
                connection.end();
                return;

                break;
            default:
            // code block
        }
        return;

    });

}

mainFunction();
