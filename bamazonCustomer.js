var mysql = require("mysql");
var inquirer = require("inquirer");

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
  
  var printList = function() {
   
  connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    // console.log(results);
    for (var i = 0; i < results.length; i++) {
      var info = results[i];
     
      itemArr.push(info.id  + "). " +
      info.product_name  + " " +
      info.department_name + " $" +
      info.price);
    
    }
    // console.log(itemArr);
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'item',
        message: "What would you like to purchase?",
        paginated: true,
        choices: itemArr
      }

    ])
    .then(answers => {
      // console.log(answers);
      return;
    });
  })
}
printList();





  connection.end();

  // product_name, department_name, price, stock_quantity