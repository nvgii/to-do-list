$(document).ready(function () {
    todoListe = $('.todoListe');
    var todos;
    $.ajax('http://localhost:3000/listtodolist')
        .done(data => {
            todos = JSON.parse(data);
            console.log(JSON.parse(data));
            for (todo of todos.todoListe) {
                todoListe.append(`
            <div class="form">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input">
                </div>
                <input type="text" class="form-control input" aria-label="Text input with checkbox" value="${todo.label}" onchange="showButtons(this)">
                <button type="button" class="bi bi-check-lg hide btn btn-outline-success check"></button>
                <button type="button"  class="bi bi-x-lg hide x btn btn-outline-secondary"></button>
                <button type="button" class="btn btn-outline-danger bi bi-trash top-0 end-0" onclick="deleteItem(this)"></button>
            </div>
`);
}
})
})

function addItemToTodoList() {
    var label = $('#todo').val();
    todoListe.append(`

            <div class="form">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input">
                </div>
                <input type="text" class="form-control input" aria-label="Text input with checkbox" value="${label}" onchange="showButtons(this)">
                <button type="button"  class="bi bi-check-lg hide btn btn-outline-success check"></button>
                <button type="button" class="bi bi-x-lg hide x btn btn-outline-secondary"></button>
                <button type="button" class="btn btn-outline-danger bi bi-trash top-0 end-0" onclick="deleteItem(this)"></button>
            </div>

`);
    $('#todo').val('');

    $.ajax(`http://localhost:3000/listtodolist`, {
        method: 'post',
        data: {
            label: label,
            description: ''
        },
        dataType: 'JSON'
    }).done(data => {})
}

function deleteItem(event) {
    id = todo.id;
    var buttonElement = $(event);
    var listElement = buttonElement.parent().parent().parent();
    listElement.remove();
    $.ajax(`http://localhost:3000/listtodolist/${id}`, {
        method: 'delete',
        dataType: 'JSON'
    }).done(data => {
        window.location.reload();
    })
}

function editTodo(event){
    id = todo.id;
    var buttonElement = $(event);
    var inputField = $('.input').val();
    console.log(inputField);
  
}

function showButtons(event){
    var clickElement = $(event);
    console.log( "clicked" );
    clickElement.siblings(".hide").css("display", "block");
}
