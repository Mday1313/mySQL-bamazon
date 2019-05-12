CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL, 
    department_name VARCHAR(50), 
    price DECIMAL(5,3), 
    stock_quantity INTEGER(10),
    PRIMARY KEY(id)
); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad-6th Generation", "Electronics", 350.00, 25),
	   ("Troll Doll", "Toys", 6.00, 45),
       ("The Breakfast Club DVD", "Entertainment", 20.00, 4),
       ("Goonies T-Shirt", "Clothing", 15.50, 22),
       ("Pop Rocks, 12ct, Assorted", "Candy", 13.00, 50),
       ("Lord of the Rings Trilogy Box Set", "Entertainment", 40.00, 10),
       ("Downward Spiral- NIN", "Vinyl", 35.00, 5),
       ("Really Awesome Camping Gear", "Outdoors", 150.00, 12),
       ("Dog Leash", "Pets", 9.00, 25),
       ("Fancy Espresso Machine", "Kitchen", 120.00, 20);
       
UPDATE products SET product_name="Slinky", department_name="Toys", price=19.00, stock_quantity=35 WHERE id=1;