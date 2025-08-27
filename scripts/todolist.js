
document.querySelector('.add-task-btn').addEventListener('click', addTask);

let selectedTask = null;

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'task';
    li.setAttribute('draggable', 'true');
    if (completed) li.classList.add('completed');
    li.innerHTML = `
        <div class="checkbox"></div>
        <p class="task-name">${text}</p>
    `;
    addDragEvents(li);
    addCheckboxEvent(li);

    li.addEventListener('click', function(e) {
        if (selectedTask) selectedTask.classList.remove('selected');
        selectedTask = li;
        li.classList.add('selected');
    });

    return li;
}

document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (!selectedTask) return;

    if (e.key === '-') {
        selectedTask.remove();
        saveTasks();
        selectedTask = null;
    }

    if (e.key === 'e') {
        e.preventDefault();
        const textEl = selectedTask.querySelector('.task-name');
        const oldText = textEl.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldText;
        input.className = 'task-edit-input';
        input.addEventListener('keydown', ev => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                const newText = input.value.trim();
                if (newText !== "") {
                    textEl.textContent = newText;
                }
                input.replaceWith(textEl);
                saveTasks();
            }
        });
        textEl.replaceWith(input);
        input.focus();
    }
    
});

function addTask() {
    const input = document.querySelector('.add-task-input');
    const taskText = input.value.trim();
    if (taskText !== "") {
        const categories = document.querySelectorAll('.category-tasks');
        const ul = categories[categories.length - 1];
        const li = createTask(taskText);
        ul.appendChild(li);
        input.value = "";
        saveTasks();
    }
}

const filterSelect = document.querySelector('.filter-select');
filterSelect.addEventListener('change', () => {
    const filter = filterSelect.value.trim();
    document.querySelectorAll('.task').forEach(task => {
        const isCompleted = task.classList.contains('completed');
        if (filter === 'all') {
            task.style.display = '';
        } else if (filter === 'completed') {
            task.style.display = isCompleted ? '' : 'none';
        } else if (filter === 'incompleted') {
            task.style.display = !isCompleted ? '' : 'none';
        }
    });
});

function addDragEvents(item) {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
}

let draggingEl = null;

function dragStart() {
    draggingEl = this;
    this.classList.add('dragging');
}

function dragEnd() {
    this.classList.remove('dragging');
    draggingEl = null;
    saveTasks();
}

const lists = document.querySelectorAll('.category-tasks');

lists.forEach(list => {
    list.addEventListener('dragover', e => {
        e.preventDefault();
        if (!draggingEl) return;
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggingEl);
        } else {
            list.insertBefore(draggingEl, afterElement);
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    draggableElements.forEach(child => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            closest = { offset, element: child };
        }
    });
    return closest.element;
}
document.querySelectorAll('.task').forEach(addDragEvents);

function addCheckboxEvent(task) {
    const checkbox = task.querySelector('.checkbox');
    checkbox.addEventListener('click', () => {
        task.classList.toggle('completed');
        saveTasks();
    });
}

document.querySelectorAll('.task').forEach(addCheckboxEvent);

function saveTasks() {
    const categories = document.querySelectorAll('.category-tasks');
    const data = {};
    categories.forEach(cat => {
        const catId = cat.id;
        const tasks = [];
        const seen = new Set();
        cat.querySelectorAll('.task').forEach(task => {
            const text = task.querySelector('.task-name').textContent;
            if (seen.has(text)) return;
            seen.add(text);
            const completed = task.classList.contains('completed');
            tasks.push({ text, completed });
        });
        data[catId] = tasks;
    });
    localStorage.setItem('tasks', JSON.stringify(data));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('tasks') || '{}');
    Object.keys(data).forEach(catId => {
        const cat = document.getElementById(catId);
        if (!cat) return;
        data[catId].forEach(taskData => {
            const li = createTask(taskData.text, taskData.completed);
            cat.appendChild(li);
        });
    });
}

loadTasks();