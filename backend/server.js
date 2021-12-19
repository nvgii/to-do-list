var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// vorhandene Liste anzeigen
app.get('/listtodolist', function (request, response) {
    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        response.end(data);
    });
})

//Löschen
app.delete('/listtodolist/:id', function (request, response) {
    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        id = request.params.id;
        data = JSON.parse(data);
        todos = data.todoListe;

        for (todo of todos) {
            if (todo.id == id) {
                index = todos.indexOf(todo);
                todos.splice(index, 1);
                fs.writeFile('todoListe.json', JSON.stringify({
                    "todoListe": todos
                }), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        }
        response.end(JSON.stringify(todos));
    });
})

//bestimmtes Element anzeigen
app.get('/listtodolist/:id', function (request, response) {
    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        id = request.params.id;
        data = JSON.parse(data);
        todos = data.todoListe;

        for (todo of todos) {
            //finde todo mit id
            if (todo.id == id) {
                response.end(JSON.stringify(todo));
            }
        }
    });
})

// Bearbeiten    
app.put('/listtodolist/:id', function (request, response) {
    id = request.params.id;
    incomeTodo = request.body;
    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        data = JSON.parse(data);

        todos = data.todoListe;

        for (todo of todos) {
            //finde todo mit id
            if (todo.id == id) {
                index = todos.indexOf(todo);
                todos[index]= incomeTodo; 
                data.todoListe = todos;

                data = JSON.stringify(data);
                fs.writeFile(__dirname + "/" + "todoListe.json", data, function (err) {
                    if (err) return console.log(err);
                    console.log('success');
                    response.end(data);
                });
            }
        }


    });
})

//Zufall ID-Generator
function randomId(){
    return Math.random().toString(16).slice(2)
}

// Neues Todo-Element in die Liste setzen
app.post('/listtodolist', function (request, response) {
    incomingTodo = request.body;
    
    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        todos = data.todoListe;
        data = JSON.parse(data);
        newId = randomId();
        incomingTodo["id"]=newId;
        
        data.todoListe.push(incomingTodo);
        data = JSON.stringify(data)
        fs.writeFile(__dirname + "/" + "todoListe.json", data, function (err) {
            if (err) return console.log(err);
            console.log('success');
            response.end(data);
        });
    });
})








var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})