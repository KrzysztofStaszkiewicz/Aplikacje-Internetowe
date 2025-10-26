const addInput = document.getElementById("add");
const dateInput = document.getElementById("date");
const addButton = document.getElementById("bttn");
const taskList = document.getElementById("taskList");
const search = document.getElementById("search");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        li.innerHTML = `
            <span>${task.text}</span>
            <small>${task.date}</small>
            <button class="delete-btn" data-index="${index}">Usuń</button>
        `;

        taskList.appendChild(li);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

addButton.addEventListener("click", () => {
    const text = addInput.value.trim();
    const date = dateInput.value;

    if (text.length < 3) {
        alert("zadanie musi mieć conajmniej 3 znaki");
        return;
    }
    else if (text.length > 255){
        alert("zadanie nie może mieć więcej niż 255 znaków");
        return;
    }
    else if(new Date(date) < new Date().setHours(0,0,0,0)){
        alert("data nie może być z przeszłości");
        return;
    }

    const newTask = { text, date };
    tasks.push(newTask);
    renderTasks();

    addInput.value = "";
    dateInput.value = "";
});

taskList.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("delete-btn")) {
        const index = target.dataset.index;
        tasks.splice(index, 1);
        renderTasks();
        return;
    }

    const li = target.closest("li");
    if (!li || li.querySelector(".edit-input")) return;

    const index = [...taskList.children].indexOf(li);
    const oldText = tasks[index].text;
    const oldDate = tasks[index].date;

    const editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = oldText;
    textInput.classList.add("edit-input");

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = oldDate;
    dateInput.classList.add("edit-date");

    editContainer.appendChild(textInput);
    editContainer.appendChild(dateInput);

    li.innerHTML = "";
    li.appendChild(editContainer);

    textInput.focus();
    textInput.select();

    function saveChanges() {
        const newText = textInput.value.trim();
        const newDate = dateInput.value;
        const today = new Date().setHours(0, 0, 0, 0);
        const chosen = new Date(newDate).setHours(0, 0, 0, 0);

        if (newText.length < 3) {
            alert("Zadanie musi mieć co najmniej 3 znaki.");
            renderTasks();
            return;
        } else if (newText.length > 255) {
            alert("Zadanie nie może mieć więcej niż 255 znaków.");
            renderTasks();
            return;
        }

        if (chosen < today) {
            alert("Data nie może być z przeszłości.");
            renderTasks();
            return;
        }

        tasks[index].text = newText;
        tasks[index].date = newDate;
        renderTasks();
    }

    document.addEventListener(
        "click",
        function handler(ev) {
            if (!li.contains(ev.target)) {
                saveChanges();
                document.removeEventListener("click", handler);
            }
        },
        { capture: true }
    );

    textInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            saveChanges();
        }
    });
    dateInput.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            saveChanges();
        }
    });
});

search.addEventListener("input", () => {
    const term = search.value.toLowerCase();

    taskList.innerHTML = "";

    if (term.length < 2) {
        renderTasks();
        return;
    }

    const filtered = tasks.filter(task =>
        task.text.toLowerCase().includes(term)
    );

    filtered.forEach((task, index) => {
        const li = document.createElement("li");

        const regex = new RegExp(`(${term})`, "gi");
        const highlightedText = task.text.replace(
            regex,
            '<span class="highlight">$1</span>'
        );

        li.innerHTML = `
            <span>${highlightedText} <small>(${task.date})</small></span>
            <button class="delete-btn" data-index="${index}">Usuń</button>
        `;
        taskList.appendChild(li);
    });
});

renderTasks();
