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
    showMenu();
});

function showMenu(){
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            name: "options",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function (answer){
        switch(answer.options){
            case "View Product Sales by Department":
            viewDepartments();
            break;

            case "Create New Department":
            createDepartment();
            break;

            case "Exit":
            exitView();
            break;
        };
    });
};

function viewDepartments(){
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.department_name, products.product_sales "
    query += "FROM departments LEFT JOIN products ON (departments.department_name = products.department_name) "
    query += "GROUP BY departments.department_id, departments.department_name, departments.over_head_costs, products.department_name, products.product_sales "
    query += "ORDER BY departments.department_id";
    connection.query(query, function(err, res){
        if (err) throw err;
        for(var i = 0; i < res.length; i++){
            console.log("Department ID: " + res[i].department_id + "\nDepartment Name: " + res[i].department_name + "\nOver Head Costs: " + res[i].over_head_costs + "\nProduct Sales: " + res[i].product_sales + "\nTotal Profit: " + (res[i].product_sales - res[i].over_head_costs));
            console.log("*********************************************");
        }
        showMenu();
    });
};

function createDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "name"
        },
        {
            type: "input",
            message: "What will the overhead cost be?",
            name: "cost",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }   
        }
    ]).then(function(answer){
        var query = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)"
        connection.query(query, [answer.name, answer.cost], function(err, res){
            if(err) throw err;
            return (res);
        });
        showMenu()
    });
}

function exitView(){
    console.log("Good-bye!");
    connection.end();
};