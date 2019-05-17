
# Welcome to Bamazon <h1>

This is a Command Line Application. It is designed as an interface for either a customer or manager access.

## Customer View <h2> 

node bamazonCustomer.js will get you to the customer access.  Here you are presented with a prompt for how you would like to search

![Image of Intro Prompt](images/customer_intro.png) 

When you select "Shop all items" a list will be populated with data from the mySQL database. Scroll throught the list and select an item to purchase. 

![Image of List of Items](images/customer_item_list.png)

Choose an item, enter the amount of units you would like to purchase. Database will be checked to see if there is sufficient inventory.  

![Image of List of Items](images/customer_check_inventory.png)

You are then prompted to either go to checkout or continue shopping.  You may add as many items to your cart as you would like. 

![Image of List of Items](images/customer_checkout.png)

## Manager View <h2>

In order to enter the manager app:
 
 >node bamazonManager.js

On start, you are presented with the following options...

![Image of List of Items](images\manager_menu.png)

### View Products for Sale <h3>

This option will query all the inventory from the mySQL database and present all items in a basic table.

![Image of List of Items](images\manager_all.png)

### View Low Inventory <h3> 

This option will query all the inventory from the mySQL database and present all item with a stock_quantity less than 5 in a basic table.

![Image of List of Items](images\manager_low.png)

### Add to Inventory <h3>

Option that allows the user to select an item from a list and update the database with the number of units in stock.

![Image of List of Items](images\manager_list.png)
![Image of List of Items](images\manager_update.png)

### Add New Product <h3>

Option that allows the user to select an item from a list and update the database with an entirely new product and all the corresponding information.

![Image of List of Items](images\manager_new.png)
![Image of List of Items](images\manager_last.png)

### EXIT <h3>

Leaves the program.