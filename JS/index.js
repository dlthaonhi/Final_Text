var taskIdCounter=0; 
const status_array = ['todo', 'doing', 'completed', 'blocked'];
var lists = document.querySelectorAll(".main_area");
var radioValue;


document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById("new_task").addEventListener("click", function() {
        document.getElementById("new_todo").style.display = 'block';
        document.querySelector(".new_todo_title").textContent = "Add new todo";
        document.getElementById("submit").style.display = 'block';
        document.getElementById("edit").style.display = 'none';
        document.getElementById("task_choice").style.display='none'
    });

    document.getElementById("close_task").addEventListener("click", function() {
        document.getElementById("new_todo").style.display = 'none';
        resetForm();
    });

    document.getElementById("submit").addEventListener("click", storeNewTask);

    window.addEventListener("load", reload)

    // dragDrop();
    reloadCounter();
});


function reload() {
    const taskList = JSON.parse(localStorage.getItem('todoList')) || [];
    status_array.forEach(status => {
        taskList.forEach(task => {
            if (task.status == status) renderTask(task,String(status+'List')); 
        });
        // console.log(String(status+'List'));
    })
}



function resetForm() {
    document.getElementById('new_cate').value = '';
    document.getElementById('new_title').value = '';
    document.getElementById('new_content').value = '';
    document.getElementById('new_cate').style.border = "1px solid black";
    document.getElementById('new_title').style.border = "1px solid black";
    document.getElementById('new_content').style.border = "1px solid black";
    console.log("da reset");
}

function checkValue(new_cate,new_title,new_content) {
    let check = 0;
    console.log(new_cate);
    if (!new_cate || (/^\s*$/.test(new_cate))) {
        console.log("Chưa nhập Category");
        document.getElementById('new_cate').style.border = "2px solid #ff0000";
        check ++;
    }
    else document.getElementById('new_cate').style.border = "2px solid #3BC057";
    if (!new_title || (/^\s*$/.test(new_title))) {
        console.log("Chưa nhập Title");
        document.getElementById('new_title').style.border = "2px solid #ff0000";
        check ++;
    }
    else document.getElementById('new_title').style.border = "2px solid #3BC057";
    if (!new_content || (/^\s*$/.test(new_content))) {
        console.log("Chưa nhập Content");
        document.getElementById('new_content').style.border = "2px solid #ff0000";
        check++;
    }
    else document.getElementById('new_content').style.border = "2px solid #3BC057";
    if (check > 0) return false;
    else return true;
}

function checkElement(element) {
    console.log(element);

    const value = element.value;

    if (!value || (/^\s*$/.test(value))) {
        console.log("Chưa nhập Category");
        document.getElementById(element.id).style.border = "2px solid #ff0000";
    }
    else document.getElementById(element.id).style.border = "2px solid #3BC057";

}

const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});


// -----STORE_NEW-----

// when click submit "add new task"
function storeNewTask() {
    const new_cate = document.getElementById('new_cate').value;
    const new_title = document.getElementById('new_title').value;
    const new_content = document.getElementById('new_content').value;
    
    let check= checkValue(new_cate,new_title,new_content); 
    if (check == true) {
        var taskIdCounter = localStorage.getItem('todoCount')
        const task = { 
            id: ++taskIdCounter,
            category: new_cate, 
            title: new_title, 
            content: new_content,
            status: 'todo'
        };
        
    
        let taskList = JSON.parse(localStorage.getItem('todoList')) || [];
        taskList.push(task);
        localStorage.setItem('todoList', JSON.stringify(taskList));
        console.log(taskList);
    
        console.log(task.status);
        renderTask(task,String(task.status+'List'));

        document.getElementById("new_todo").style.display = 'none';
        resetForm();  
        reloadCounter();  
    }
    // console.log(typeof(new_cate));
    
}

var taskId;
function renderTask(task,addList) {
    if (task == null) return;
    const tasks = document.getElementById(String(addList));
    console.log("addList",String(addList));
    const li = document.createElement('li');
    li.classList.add("task_area");

    li.innerHTML = `
        <div class="task_title">
            <div class="task_title_text">
                <p>${task.category}</p>
                <h4>${task.title}</h4>
            </div>
            <div class="task_title_icon">
                <i class="edit_task fa-regular fa-pen-to-square" data-id="${task.id}"></i>
                <i class="delete_task fa-regular fa-trash-can" data-id="${task.id}"></i>
            </div>
        </div>
        <div class="task_content">
            <div class="line"></div>
            <div class="task_main">
                <p>${task.content}</p>
            </div>
            <div class="task_date">
                <i class="fa-regular fa-clock"></i>
                <p>${date}</p>
            </div>
        </div>
    `;

    li.draggable = true;

    let radio = document.querySelector(`input[name="status"][value="${String(addList).replace(/List/g,'')}"]`);
    console.log(radio);
    radio.checked = true;     

    tasks.appendChild(li);

    // let status = task.status;
    // document.querySelector(`input[name="status"][value="${status}"]`).checked = true;


    const deleteButton = li.querySelector(".delete_task");
    deleteButton.addEventListener("click", function() {
        taskId = this.getAttribute("data-id");
        console.log("ID :", taskId);
        deleteTask(taskId,'taskList');
    });

    const editButton =li.querySelector(".edit_task");
    editButton.addEventListener("click", function() {
        console.log("THIS: ",this)
        taskId = this.getAttribute("data-id");
        // getStatusInLocal()
        console.log("ID :", taskId);
        editTask(taskId);
    });
}

var taskList;
//when click icon "Edit"
function editTask(taskId) {
    //Hien giao dien Edit
    resetForm();
    document.querySelector('.task_choice').style.display = 'flex';
    document.getElementById("new_todo").style.display = 'block';
    document.querySelector(".new_todo_title").textContent = "Edit Task";
    document.getElementById("submit").style.display = 'none';
    document.getElementById("edit").style.display = 'block';
    // document.querySelector(".task_choice").style.display='flex';

    // // console.log(this.status);
    // let statusOld = this.parentNode;
    // console.log(statusOld);

    // var radios = document.getElementsByName('status');
    // for (var i=0;i<radios.length;i++) {
    //     if (radios[i].checked) {
    //         console.log(radios[i].value);
    //         break;
    //     }
    // }

    taskList = JSON.parse(localStorage.getItem('todoList')) || [];
    editing_task = taskList.find(task =>  parseInt(task.id) == parseInt(taskId));
    // console.log(editing_task);
    // if (editing_task == undefined) {
    //     let taskList = JSON.parse(localStorage.getItem(String(statusNow+'List'))) || [];
    //     editing_task = taskList.find(task => task.id == parseInt(taskId));    
    //     let radio = document.querySelector(`input[name="status"][value="${statusNow}"]`);
    //     console.log(radio);
    //     radio.checked = true;    
    // }
    document.getElementById('new_cate').value = editing_task.category;
    document.getElementById('new_title').value = editing_task.title;
    document.getElementById('new_content').value = editing_task.content;
    // oldList = editing_task.status + 'List';
    // console.log("old: ",oldList);
    //checked_radio
    // console.log(editing_task.status);

}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("edit").addEventListener("click", function () {
        // console.log("abc");
        storeTask(taskId);
    });
});

function storeTask(taskId) {
    // console.log('hihi');
    var radios = document.getElementsByName('status');
    for (var i=0;i<radios.length;i++) {
        if (radios[i].checked) {
            console.log(radios[i].value);
            break;
        }
    }
    //luu radio vao html
    let radio = document.querySelector(`input[name="status"][value="${radios[i].value}"]`);
    console.log(radio);
    radio.checked = true;

    // localList = String(radios[i].value+'List');
    // if (radios[i].value == 'doing') localList = 'doingList';
    // if (radios[i].value == 'completed') localList = 'completedList';
    // if (radios[i].value == 'blocked') localList = 'blockedList';
    // console.log(localList);

    
    taskList = JSON.parse(localStorage.getItem('todoList')) || [];
    // let oldTakeList = JSON.parse(localStorage.getItem(String(oldList))) || [];
    // console.log("List ne", oldTakeList);
    let editing_task_index = taskList.findIndex(task => task.id == parseInt(taskId));
    // var checkedradio = $('[name="status"]:radio:checked').val();

    // let localTakeList = JSON.parse(localStorage.getItem(String(localList))) || [];

    // console.log(ra);
    const new_cate = document.getElementById('new_cate').value;
    const new_title = document.getElementById('new_title').value;
    const new_content = document.getElementById('new_content').value;

    let check = checkValue(new_cate, new_title, new_content); 
    if (check == true) {
        const task = { 
            id: taskId,
            category: new_cate, 
            title: new_title, 
            content: new_content,
            status: radios[i].value
        };
        console.log(task);
        console.log(editing_task_index);
    
        taskList[editing_task_index]=task;
        localStorage.setItem('todoList', JSON.stringify(taskList))
        if (String(editing_task.status) !== String(radios[i].value)) {
            // deleteTask(taskId);
            const taskElement = document.querySelector(`.delete_task[data-id="${taskId}"]`).closest('.task_area');
            taskElement.remove();
            renderTask(taskId,String(radios[i].value + 'List')) 
        }
        else {
            const taskElement = document.querySelector(`.delete_task[data-id="${taskId}"]`).closest('.task_area');
            taskElement.remove();
            renderTask(taskId,String(radios[i].value + 'List'))    
        }
        document.getElementById("new_todo").style.display = 'none';
    
    
        // reload();
        resetForm();
    }

}

// -----DELETE-TASK-----
function deleteTask(taskId) {
    console.log("ID của task cần xóa:", taskId);
    // if (deleteList == 'taskList') {
    //     var radios = document.getElementsByName('status');
    //     for (var i=0;i<radios.length;i++) {
    //         if (radios[i].checked) {
    //             console.log(radios[i].value);
    //             break;
    //         }
    //     }
    //     deleteList=String(radios[i].value+"List")
    // }

    // console.log(deleteList);
    const taskElement = document.querySelector(`.delete_task[data-id="${taskId}"]`).closest('.task_area');
    taskElement.remove();

    let taskList = JSON.parse(localStorage.getItem('todoList')) || [];
    taskList = taskList.filter(task => {
        parseInt(task.id) !== parseInt(taskId);
        console.log("task_delete_id",task.id, '  ', taskId);
    });
    console.log("deleteList", taskList);
    // console.log(deleteList);
    localStorage.setItem('todoList', JSON.stringify(taskList));
    reloadCounter();
}
