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
  
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("I'm connected");
  });

  var itemArr = [];
  var amtOrdered = "";
  var itemID = "";
  var itemQuantity = "";

  var checkInventory = function(){
    // query that plugs in id num to pull out quantity
    // var query = "SELECT * FROM products WHERE id=?";
    connection.query('SELECT * FROM products WHERE id= ?', [itemID], function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    // If quantity is equal of > amt ordered and above 0, subtract from quantity and move on with order
    // Else log INSUFFICENT INVENTORY, return to shop All list
    // console.log("In checkInventory function.\n")
    // console.log('Checking inventory for ' + amtOrdered + ' items.');
    // console.log(itemID);
    })

    connection.end();
  }
  
  var shopAll = function() {
   
  connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    // console.log(results);
    for (var i = 0; i < results.length; i++) {
      var info = results[i];
     
      itemArr.push(info.id  + "). " +
      info.product_name  + "  " +
      chalk.red( " $" +
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
  ])  .then(answers => {
    switch(answers.action) {
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