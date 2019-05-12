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
    console.log("I'm connected");
  });

  var itemArr = [];
  
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
    // console.log(itemArr);
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'item',
        message: "What would you like to purchase?",
        // paginated: true,
        choices: itemArr
      }

    ])
    .then(answers => {
      // console.log(answers);
      return;
    });
  })
}


function shopByDepartment() {
  console.log("Work in progress");
}


function mainFunction() {
  console.log(chalk.blue("Welcome to Bamazon\n"));
  
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Shop all items', 'Shop by Department', 'Checkout', 'EXIT']
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
      case 'Checkout':
        // function to 
        break;
      case 'EXIT':
      connection.end();
        return;
        break;
      default:
        // code block
    }
 
  });
}
mainFunction();
 



  // product_name, department_name, price, stock_quantity