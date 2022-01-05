$(document).ready(function () {
    todoListe = $('.todoListe');
    doneListe = $('.doneListe');
    var todos;
    $.ajax('http://localhost:3000/listtodolist')
        .done(data => {
            todos = JSON.parse(data);
            console.log(JSON.parse(data));
            for (todo of todos.todoListe) {
                todoListe.append(`
            <div class="form">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input input" onclick="moveItem(this)">
                </div>
                <input id="${todo.id}" type="text" class="form-control input" value="${todo.label}" onclick="showButtons(this)">
                <button type="button" class="bi bi-check-lg hide btn btn-outline-success check" onclick="editTodo(this)"></button>
                <button type="button"  class="bi bi-x-lg hide x btn btn-outline-secondary"></button>
                <button type="button" class="btn btn-outline-danger bi bi-trash top-0 end-0" onclick="deleteItem(this)"></button>
            </div>
`);
            }
        })

        $.ajax('http://localhost:3000/listdonelist')
        .done(data => {
            doneTodos = JSON.parse(data);
            console.log(JSON.parse(data));
            for (todo of doneTodos.doneListe) {
                doneListe.append(`
            <div class="form">
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input input" onclick="moveItemBack(this)" checked>
                </div>
                <input id="${todo.id}" type="text" class="form-control input" value="${todo.label}" onclick="showButtons(this)">
                <button type="button" class="bi bi-check-lg hide btn btn-outline-success check" onclick="editTodo(this)"></button>
                <button type="button"  class="bi bi-x-lg hide x btn btn-outline-secondary"></button>
                <button type="button" class="btn btn-outline-danger bi bi-trash top-0 end-0" onclick="deleteItem(this)"></button>
            </div>
`);
            }
        })
})

function addItemToTodoList() {
    var label = $('#todo').val();
    $.ajax(`http://localhost:3000/listtodolist`, {
        method: 'post',
        data: {
            label: label,
            description: ''
        },
        dataType: 'JSON'
    }).done(data => {
        console.log(data);
        id = data.id;
        todoListe.append(`

        <div class="form">
            <div class="input-group-text">
                <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" onclick="moveItem(this)">
            </div>
            <input id="${id}" type="text" class="form-control input" value="${label}" onclick="showButtons(this)">
            <button type="button"  class="bi bi-check-lg hide btn btn-outline-success check" onclick="editTodo(this)"></button>
            <button type="button" class="bi bi-x-lg hide x btn btn-outline-secondary"></button>
            <button type="button" class="btn btn-outline-danger bi bi-trash top-0 end-0" onclick="deleteItem(this)"></button>
        </div>

`);
    })

    $('#todo').val('');
}

function moveItem(event) {
    console.log("moveItem Geklickt");
    var checkbox = $(event);
    console.log(checkbox);
    var id = checkbox.parent().siblings()[0].id;
    console.log(id);

    $.ajax(`http://localhost:3000/listtodolist/move/${id}`, {
        method: 'get',
        dataType: 'JSON'
    }).done(data => {
        window.location.reload();
    })
    window.location.reload();
}

function moveItemBack(event) {
    console.log("moveItemBack Geklickt");
    var checkbox = $(event);
    console.log(checkbox);
    var id = checkbox.parent().siblings()[0].id;
    console.log(id);

    $.ajax(`http://localhost:3000/listdonelist/move/${id}`, {
        method: 'get',
        dataType: 'JSON'
    }).done(data => {
        window.location.reload();
    })
    window.location.reload();

}

function deleteItem(event) {
    var htmlElement = $(event);
    
    id = htmlElement.siblings()[1].id;
    var listElement = htmlElement.parent();
    var liste = listElement.parent();
    var listId= liste[0].id;
    listElement.remove();
    $.ajax(`http://localhost:3000/${listId}/${id}`, {
        method: 'delete',
        dataType: 'JSON'
    }).done(data => {
        window.location.reload();
    })
}




function editTodo(event) {
    var htmlElement = $(event);
    var inputElement = htmlElement.siblings()[1];
    var label = inputElement.value;
    var id = inputElement.id;
    console.log(label, id);

    $.ajax(`http://localhost:3000/listtodolist/${id}`, {
        method: 'put',
        dataType: 'JSON',
        data: {
            label: label,
            description: '',
            id: id
        },
    }).done(data => {
        window.location.reload();
    })


}

function showButtons(event) {
    var clickElement = $(event);
    id = clickElement.context.id;
    clickElement.siblings(".hide").css("display", "block");
}