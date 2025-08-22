document.querySelector('.add-task-btn').addEventListener("click", addTask);


function addTask() {
    const input = document.querySelector('.add-task-input');
    const taskText = input.value.trim();

    if (taskText !== "") {
        const lastCategory = document.querySelectorAll('.category-tasks');
        const ul = lastCategory[lastCategory.length - 1];
        const li = document.createElement('li');
        li.className = 'task';
        li.innerHTML = `
            <div class="checkbox"></div>
            <p class="task-name">${taskText}</p>
        `;
        ul.appendChild(li);
        input.value = "";
    }
}