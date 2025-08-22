
document.querySelector('.add-task-btn').addEventListener('click', addTask);

function createTask(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'task dynamic';
    li.setAttribute('draggable', 'true');
    if (completed) li.classList.add('completed');
    li.innerHTML = `
        <div class="checkbox"></div>
        <p class="task-name">${text}</p>
    `;
    addDragEvents(li);
    addCheckboxEvent(li);
    return li;
}

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

function addDragEvents(item) {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
}

function dragStart() {
    this.classList.add('dragging');
}

function dragEnd() {
    this.classList.remove('dragging');
    saveTasks();
}

const lists = document.querySelectorAll('.category-tasks');

lists.forEach(list => {
    list.addEventListener('dragover', e => {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(dragging);
        } else {
            list.insertBefore(dragging, afterElement);
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
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
            tasks.push({
                text: text,
                completed: completed,
                dynamic: task.classList.contains('dynamic')
            });
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
            if (taskData.dynamic) {
                const li = createTask(taskData.text, taskData.completed);
                cat.appendChild(li);
            } else {
                const li = [...cat.querySelectorAll('.task')].find(
                    t => t.querySelector('.task-name').textContent === taskData.text
                );
                if (li && taskData.completed) li.classList.add('completed');
            }
        });
    });
}

loadTasks();