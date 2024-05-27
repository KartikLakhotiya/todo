const addButton = document.getElementById('addTask');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const allTasksTab = document.getElementById('allTasksTab');
const pendingTasksTab = document.getElementById('pendingTasksTab');
const completedTasksTab = document.getElementById('completedTasksTab');

loadTasks();

function addTask() {
    const task = taskInput.value;
    if (task) {
        createTaskElement({ task, status: 'pending' });
        taskInput.value = '';
        saveTasks();
        location.reload();
    } else {
        document.getElementById('validate').style.display = "block";
    }
}

addButton.addEventListener('click', addTask);

allTasksTab.addEventListener('click', () => filterTasks('all'));
pendingTasksTab.addEventListener('click', () => filterTasks('pending'));
completedTasksTab.addEventListener('click', () => filterTasks('completed'));

function createTaskElement({ task, status }) {
    const listItem = document.createElement('li');
    listItem.textContent = task;
    listItem.className = status;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'editTask';
    listItem.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteTask';
    listItem.appendChild(deleteButton);

    const statusButton = document.createElement('button');
    statusButton.textContent = status === 'pending' ? 'Mark as Completed' : 'Mark as Pending';
    statusButton.className = 'statusTask';
    listItem.appendChild(statusButton);

    taskList.appendChild(listItem);

    editButton.addEventListener('click', () => editTask(listItem));

    
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listItem);
        saveTasks();
        location.reload();
    });
    statusButton.addEventListener('click', () => toggleStatus(listItem, statusButton));
}

function editTask(listItem) {
    const currentTask = listItem.firstChild.textContent;
    const newTask = prompt("Edit your task:", currentTask);
    if (newTask !== null && newTask !== '') {
        listItem.firstChild.textContent = newTask;
        saveTasks();
        location.reload()
    }
    else{
        // alert("Cannot add an empty task.")
        document.getElementById('validate-edit').style.display = "block";
    }
}

function toggleStatus(listItem, statusButton) {
    if (listItem.className === 'pending') {
        listItem.className = 'completed';
        statusButton.textContent = 'Mark as Pending';
    } else {
        listItem.className = 'pending';
        statusButton.textContent = 'Mark as Completed';
    }
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    taskList.querySelectorAll('li').forEach(item => {
        tasks.push({
            task: item.firstChild.textContent,
            status: item.className
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(createTaskElement);
}

function filterTasks(filter) {
    allTasksTab.classList.remove('active');
    pendingTasksTab.classList.remove('active');
    completedTasksTab.classList.remove('active');

    if (filter === 'all') {
        allTasksTab.classList.add('active');
        taskList.querySelectorAll('li').forEach(item => {
            item.style.display = 'flex';
        });
    } else if (filter === 'pending') {
        pendingTasksTab.classList.add('active');
        taskList.querySelectorAll('li').forEach(item => {
            item.style.display = item.className === 'pending' ? 'flex' : 'none';
        });
    } else if (filter === 'completed') {
        completedTasksTab.classList.add('active');
        taskList.querySelectorAll('li').forEach(item => {
            item.style.display = item.className === 'completed' ? 'flex' : 'none';
        });
    }
}
