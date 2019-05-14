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
var t = "";

function printTable() {

    t = new Table
    console.log("           All Products           ");
     
    data.forEach(function(product) {
        t.cell('Product Id', product.id)
        t.cell('Description', product.desc)
        t.cell('Qunatity', product.quantity)
        t.cell('Price, USD', product.price, Table.number(2))
        t.newRow()
      })

      console.log(t.toString());
      console.log();
      console.log("__________________________________________\n");
      mainFunction();
}

  function allProducts(){
      data = [];
   
        connection.query('SELECT * FROM products', function (error, results, fields) {
          if (error) throw error;
          // console.log(results);
          console.log();
          for (var i = 0; i < results.length; i++) {
            var info = results[i];
      
            data.push(  { id: info.id, desc: info.product_name, quantity: info.stock_quantity, price: info.price });
          }
        
   
    printTable();
     


})

}

function lowInventory(){
    data = [];
   
    connection.query('SELECT * FROM products', function (error, results, fields) {
      if (error) throw error;
      // console.log(results);
      console.log();
      for (var i = 0; i < results.length; i++) {
        var info = results[i];
  if (info.stock_quantity < 5) {
        data.push(  { id: info.id, desc: info.product_name, quantity: info.stock_quantity, price: info.price });
      }
    }
    
t = new Table
console.log("           Low Inventory           ");
 
data.forEach(function(product) {
  t.cell('Product Id', product.id)
  t.cell('Description', product.desc)
  t.cell('Qunatity', product.quantity)
  t.cell('Price, USD', product.price, Table.number(2))
  t.newRow()
})
 
console.log(t.toString());
console.log();
console.log("__________________________________________\n");


mainFunction();
})

}

console.log("\nWelcome to Bamazon Manager Console\n");
  function mainFunction(){
     
      inquirer.prompt([
          {
              type: "list",
              name: "action",
              message: "Which action would you like to perform?",
              choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
          }
      ]).then(answers => {
        
        switch(answers.action) {
            case "View Products for Sale":
            allProducts();
              break;
            case "View Low Inventory":
            lowInventory();
              break;
            case "Add to Inventory":
              // code block
              break;
            case "Add New Product":
              // code block
              break;
            case "EXIT":
              console.log("Exiting the Program!");
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
 