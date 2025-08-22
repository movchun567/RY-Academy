document.querySelector('.add-task-btn').addEventListener('click', addTask);

function addTask() {
    const input = document.querySelector('.add-task-input');
    const taskText = input.value.trim();
    if (taskText !== "") {
        const lastCategory = document.querySelectorAll('.category-tasks');
        const ul = lastCategory[lastCategory.length - 1];
        const li = document.createElement('li');
        li.className = 'task';
        li.setAttribute('draggable', 'true');
        li.innerHTML = `
            <div class="checkbox"></div>
            <p class="task-name">${taskText}</p>
        `;
        ul.appendChild(li);
        input.value = "";
        addDragEvents(li);
        addCheckboxEvent(li);
    }
}

function addDragEvents(item) {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
}

function dragStart(e) {
    this.classList.add('dragging');
}

function dragEnd(e) {
    this.classList.remove('dragging');
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
    });
}

document.querySelectorAll('.task').forEach(addCheckboxEvent);
