var express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// sendFile will go here
app.get('/js/script_server.js', function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/js/script_server.js'));
  });

  app.get('/css/style.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/css/style.css'));
  }); 

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// vorhandene unerledigte Liste anzeigen
app.get('/listtodolist', function (request, response) {
    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        response.end(data);
    });
})

// vorhandene erledigte Liste anzeigen
app.get('/listdonelist', function (request, response) {
    fs.readFile(__dirname + "/" + "doneListe.json", 'utf8', function (err, data) {
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
//Löschen in doneListe
app.delete('/listdonelist/:id', function (request, response) {
    fs.readFile(__dirname + "/" + "doneListe.json", 'utf8', function (err, data) {
        id = request.params.id;
        data = JSON.parse(data);
        todos = data.doneListe;

        for (todo of todos) {
            if (todo.id == id) {
                index = todos.indexOf(todo);
                todos.splice(index, 1);
                fs.writeFile('doneListe.json', JSON.stringify({
                    "doneListe": todos
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

//move von todoliste
app.get('/listtodolist/move/:id', function (request, response) {
    const id = request.params.id;

    fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
        
        data = JSON.parse(data);
        todos = data.todoListe;

        for (todo of todos) {
            //finde todo mit id
            if (todo.id == id) {

                fs.readFile(__dirname + "/" + "doneListe.json", 'utf8', function (err, data) {
                    data = JSON.parse(data);
                    doneTodos = data.doneListe;
                    doneTodos.push(todo);
                    fs.writeFile('doneListe.json', JSON.stringify({
                        "doneListe": doneTodos
                    }), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                });

                
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
    });

 


   
})

//move von doneListe
app.get('/listdonelist/move/:id', function (request, response) {
    const id = request.params.id;

    fs.readFile(__dirname + "/" + "doneListe.json", 'utf8', function (err, data) {
        
        data = JSON.parse(data);
        doneTodos = data.doneListe;

        for (todo of doneTodos) {
            //finde todo mit id
            if (todo.id == id) {

                fs.readFile(__dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
                    data = JSON.parse(data);
                    todos = data.todoListe;
                    todos.push(todo);
                    fs.writeFile('todoListe.json', JSON.stringify({
                        "todoListe": todos
                    }), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                });

                
                index = doneTodos.indexOf(todo);
                    doneTodos.splice(index, 1);
    
                    fs.writeFile('doneListe.json', JSON.stringify({
                        "doneListe": doneTodos
                    }), function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
    
                 
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
            console.log(incomingTodo);
            incomingTodo=JSON.stringify(incomingTodo)
            response.end(incomingTodo);
        });
    });
})




var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})