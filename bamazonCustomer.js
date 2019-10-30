var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Canning1!",
    database: "bamazon_db"
  });

  //checks to make sure that the database and js file are connected - if yes, executes the first function
  connection.connect(function(err) {
    if (err) throw err;
    showItems();
  });

  
//function that accesses the MySQL database and outputs items with their ID, product name and price
  function showItems(){
    connection.query(
        "SELECT item_id, product_name, price FROM products",
        function(err, res) {
          if (err) throw err;
          console.log("ITEMS FOR SALE:")
          for(var i =0; i < res.length; i++){
          console.log("Item ID: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nPrice: $" + res[i].price);
          console.log("***********************************************************");
          };
          promptCustomer();
        });
  };

  //function that uses inquirer to ask customers which item they want to buy and how much they want to buy
  function promptCustomer(){
    inquirer.prompt([        {
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            name: "itemID",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            message: "How many units of this product would you like to buy?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(answer){
        //the output of the user inputs - this portion searches for the item based off the item ID
        console.log("Your order: " + answer.quantity + " units of item with ID of " + answer.itemID);
        var query = "SELECT product_name, product_sales, quantity, price FROM products WHERE ?";
        connection.query(query, {item_id: answer.itemID},
            function(err, res){
                if(err) throw err;
                //if the current quantity of the item is greater or equal to the quantity wanted by the user - order is successful
                if(res[0].quantity >= answer.quantity){
                    //updates the number in the database
                    var query = ("UPDATE products SET quantity = " + (res[0].quantity - answer.quantity) + ", product_sales = " + (res[0].product_sales + (answer.quantity * res[0].price)) + " WHERE item_id = " + answer.itemID);
                    connection.query(query, function(err, result){
                        if(err) throw err;
                        return result;
                    });
                    console.log("Order Complete! Your total is: $" + (answer.quantity * res[0].price));
                    orderAgain();
                    //if there is not enough to fulfill the order logs the following response
                }else{
                    console.log("Sorry, we don't have enough of this product to complete this purchase. Would you like to try again?");
                    orderAgain();
                };
            });
    });
};

//prompts the user if they want to make another oder - if yes, will show items and then prompt user again
function orderAgain(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to purchase another order?",
            name: "orderAgain"
        }
    ]).then(function(response){
        if(response.orderAgain){
            showItems();
        }else{
            console.log("Thank you and have a nice day!");
            connection.end();
        };
    });
};