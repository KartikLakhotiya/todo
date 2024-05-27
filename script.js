$(document).ready(function() {
    const addButton = $('#addTask');
    const taskInput = $('#taskInput');
    const taskList = $('#taskList');
    const allTasksTab = $('#allTasksTab');
    const pendingTasksTab = $('#pendingTasksTab');
    const completedTasksTab = $('#completedTasksTab');

    loadTasks();

    function addTask() {
        const task = taskInput.val();
        if (task) {
            createTaskElement({ task, status: 'pending' });
            taskInput.val('');
            saveTasks();
        } else {
            $('#validate').fadeIn().delay(2000).fadeOut();
        }
    }

    addButton.on('click', addTask);

    allTasksTab.on('click', () => filterTasks('all'));
    pendingTasksTab.on('click', () => filterTasks('pending'));
    completedTasksTab.on('click', () => filterTasks('completed'));

    function createTaskElement({ task, status }) {
        const listItem = $('<li>').addClass(status).hide();

        const taskText = $('<span>').text(task);
        listItem.append(taskText);

        const buttonContainer = $('<div>').addClass('buttonContainer');

        const editButton = $('<button>').text('Edit').addClass('editTask');
        const deleteButton = $('<button>').text('Delete').addClass('deleteTask');
        const statusButton = $('<button>').text(status === 'pending' ? 'Mark as Completed' : 'Mark as Pending').addClass('statusTask');

        buttonContainer.append(editButton, deleteButton, statusButton);
        listItem.append(buttonContainer);
        taskList.append(listItem);

        listItem.fadeIn();

        editButton.on('click', () => editTask(listItem, taskText));
        deleteButton.on('click', () => {
            listItem.fadeOut(() => {
                listItem.remove();
                saveTasks();
            });
        });
        statusButton.on('click', () => toggleStatus(listItem, statusButton));
    }

    function editTask(listItem, taskText) {
        const currentTask = taskText.text();
        const inputField = $('<input>').attr('type', 'text').val(currentTask).addClass('editInput');
        const saveButton = $('<button>').text('Save').addClass('saveTask');
        const cancelButton = $('<button>').text('Cancel').addClass('cancelTask');

        listItem.find('span').replaceWith(inputField);
        listItem.find('.editTask').replaceWith(saveButton);
        listItem.append(cancelButton);

        // Hide other buttons
        listItem.find('.deleteTask, .statusTask').hide();

        saveButton.on('click', () => {
            const newTask = inputField.val();
            if (newTask) {
                taskText.text(newTask);
                inputField.replaceWith(taskText);
                saveButton.replaceWith($('<button>').text('Edit').addClass('editTask').on('click', () => editTask(listItem, taskText)));
                cancelButton.remove();

                // Show other buttons
                listItem.find('.deleteTask, .statusTask').show();
                
                saveTasks();
            } else {
                $('#validate-edit').fadeIn().delay(2000).fadeOut();
            }
        });

        cancelButton.on('click', () => {
            inputField.replaceWith(taskText);
            saveButton.replaceWith($('<button>').text('Edit').addClass('editTask').on('click', () => editTask(listItem, taskText)));
            cancelButton.remove();

            // Show other buttons
            listItem.find('.deleteTask, .statusTask').show();
        });
    }

    function toggleStatus(listItem, statusButton) {
        if (listItem.hasClass('pending')) {
            listItem.removeClass('pending').addClass('completed');
            statusButton.text('Mark as Pending');
        } else {
            listItem.removeClass('completed').addClass('pending');
            statusButton.text('Mark as Completed');
        }
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.find('li').each(function() {
            const item = $(this);
            tasks.push({
                task: item.find('span').text(),
                status: item.attr('class')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(createTaskElement);
    }

    function filterTasks(filter) {
        allTasksTab.removeClass('active');
        pendingTasksTab.removeClass('active');
        completedTasksTab.removeClass('active');

        if (filter === 'all') {
            allTasksTab.addClass('active');
            taskList.find('li').fadeIn();
        } else if (filter === 'pending') {
            pendingTasksTab.addClass('active');
            taskList.find('li').each(function() {
                const item = $(this);
                item.toggle(item.hasClass('pending'));
            });
        } else if (filter === 'completed') {
            completedTasksTab.addClass('active');
            taskList.find('li').each(function() {
                const item = $(this);
                item.toggle(item.hasClass('completed'));
            });
        }
    }
});
