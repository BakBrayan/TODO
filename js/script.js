// seleção de  elementos 
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input"); 
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); 
const searchInput = document.querySelector("#search-input"); 
const eraseBtn = document.querySelector("#erase-button"); 
const filterBtn = document.querySelector("#filter-select"); 


let oldInputValue;

// funções 
const saveTodo = (text, done = 0, save = 1 ) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");    

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;  
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-form");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn) ;

    //utilizando dados da localStorag
    if(done){
        todo.classList.add("done");
    }

    if (save) {
        saveTodoLocalStore ({text, done});
    }

    todoList.appendChild(todo); 

    todoInput.value = "";  
    todoInput.focus();   

};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todos) => {

        let todoTitle = todos.querySelector("h3"); 

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        } 
    })
}
 
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todos) => {
        let todoTitle = todos.querySelector("h3").innerText.toLowerCase();
        
        const normalizedSearch = search.toLowerCase();

        todos.style.display = "flex";
        
        if (!todoTitle.includes(normalizedSearch)) {
            todos.style.display = "none";
   }
 });
};          

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
 
    switch (filterValue) {
        case "all" :
        todos.forEach((todo) => (todo.style.display = "flex"));
        break;

        case "done":
            todos.forEach((todo) =>
             todo.classList.contains("done") 
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
    );
    break;

    case "todo":
            todos.forEach((todo) =>
             !todo.classList.contains("done") 
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
    );
    break;  

    default:            
      break;            
  } 
};

// eventos 
todoForm.addEventListener("submit", (e) =>   {
    e.preventDefault(); 

    const inputValue = todoInput.value;

        if (inputValue) {
        saveTodo(inputValue)

    }
}); 

document.addEventListener("click", (e) => {
    const targetE1 = e.target;
    const parentE1 = targetE1.closest("div");
    let todoTitle;

    if (parentE1 && parentE1.querySelector("h3")) {
        todoTitle = parentE1.querySelector("h3").innerText;
    }

    if (targetE1.classList.contains("finish-todo")) {
        parentE1.classList.toggle("done");
    }

    if (targetE1.classList.contains("remove-todo")) {
        parentE1.remove();

        removeTodoLocalStorage(todoTitle)
    }

    if (targetE1.classList.contains("edit-form")) {
        toggleForms();
        
        editInput.value= todoTitle
        oldInputValue = todoTitle 
    }       


    });

    editForm.addEventListener("submit", (e) => {

        e.preventDefault()

        const editInputValue = editInput.value

        if (editInputValue) {
            updateTodo(editInputValue)
        }

        toggleForms()

        
    });

    searchInput.addEventListener("keyup" , (e) => {
        const search = e.target.value; 

        getSearchTodos(search);
    });

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = ""; 

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    }); 
};

const saveTodoLocalStore = (todo) => {
    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));

}; 

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

loadTodos();