var express = require('express');
var app = express();
var fs = require("fs");
var cors = require('cors')
app.use(cors())


app.get('/listtodolist', function (req, res) {
   fs.readFile( __dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
    console.log( data );
    res.end(data);
   });
})

     /**
         * 1. id aus req params holen (req anfragen)
         * 2. mit der id richtiges objekt in der json datei finden (data anfragen)
         * 3. löschen (in data löschen)
         * 4. aktualisieren für client (res send)
         */

app.delete('/listtodolist/:id', function(req,res){
    fs.readFile( __dirname + "/" + "todoListe.json", 'utf8', function (err, data) {
   
        id = req.params.id;
        data = JSON.parse(data);
        todos = data.todoListe;

        for (todo of todos ){
            if (todo.id==id){
                index=todos.indexOf(todo);
                todos.splice(index,1);
                fs.writeFile('todoListe.json', JSON.stringify(todos), function (err) {
                    if(err){return console.log(err);}
                });
            }
        }
        res.end(JSON.stringify(todos));
    });
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

