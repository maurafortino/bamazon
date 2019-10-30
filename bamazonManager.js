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
connection.connect(function (err) {
    if (err) throw err;
    showMenu()
});

function showMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to check?",
            name: "options",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (answer) {
        switch (answer.options) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;
            
            case "Exit":
                exitView();
                break;
        }
    });
};

//views all products currently in the products table
function viewProducts() {
    var query = connection.query("SELECT * FROM products",
     function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log("Item Id: " + res[i].item_id + " || Item name: " + res[i].product_name + " || Product_sales: " + res[i].product_sales + " || Price: " + res[i].price + " || Quantity: " + res[i].quantity);
            };
           tryAgain();
        }
    );
    console.log(query.sql);
};

//check on inventory lower than 5
function viewLowInventory (){
    connection.query("SELECT product_name, SUM(quantity) AS 'current_quantity' FROM products GROUP BY product_name HAVING  SUM(quantity) < 5", 
    function(err, res) {
        if (err) throw err;
        if(res.length === 0){
            console.log("No Low Inventory.");
            tryAgain();
        }else{
            for(var i = 0; i < res.length; i++){
                console.log("Product: " + res[i].product_name + " \nCurrent Quantity: " + res[i].current_quantity);
                console.log("---------------------");
            };
            tryAgain();
        };
      }
    );
};

//adds inventory to a specific product
function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            message: "Which current item would you like to add inventory to (please use item id)?",
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
            message: "How much would you like to add to the inventory?",
            name: "addition",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(answer){
        var query = "SELECT quantity FROM products WHERE ?";
        connection.query(query, {item_id: answer.itemID},
            function(err,result){
                if(err) throw err;
                query = connection.query("UPDATE products SET quantity = " + (parseInt(result[0].quantity) + parseInt(answer.addition)) + " WHERE item_id = " + answer.itemID, (function(err, res){
                    if(err) throw err;
                    return res;
                })
            )
            tryAgain();
        })
    })
};

function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "What item would you like to add?",
            name: "name"
        },
        {
            type: "input",
            message: "Which department will this item be sold in?",
            name: "department"    
        },
        {
            type: "input",
            message: "How much does each item cost?",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            message: "How much of this item is available to purchase?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(answer){
        var query = "INSERT INTO products (product_name, product_sales, department_name, price, quantity) VALUES (?, ?, ?, ?, ?)"
        connection.query(query, [answer.name, 0, answer.department, answer.price, answer.quantity], function(err, res){
            if(err) throw err;
            return res;
        });
        tryAgain();
    });
};

//prompts the manaer if they would like to look at something else
function tryAgain(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to look at something else?",
            name: "tryAgain"
        }
    ]).then(function(answer){
        if(answer.tryAgain){
            showMenu();
        }else{
            exitView();
        }
    });
};

function exitView(){
    console.log("Good-bye!");
    connection.end();
};