
const dateElement = document.querySelector(".date");
const form = document.querySelector("form");
const input = form.querySelector("input");
const taskList = document.querySelector(".tasks ul");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const taskCountElement = document.querySelector(".bottom p");
const deleteBtn = document.querySelector(".bottom button"); 


let currentFilter = "all";




const updateDate = () => {
  const today = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };
  dateElement.textContent = today.toLocaleDateString("en-GB", options);
};


const updateTaskCount = () => {
  const totalTasks = taskList.querySelectorAll("li").length;
  taskCountElement.textContent = `${totalTasks} task${
    totalTasks !== 1 ? "s" : ""
  } listed`;
};


const saveTasks = () => {
  const tasks = [];
  taskList.querySelectorAll("li").forEach((li) => {
    const checkbox = li.querySelector("input[type='checkbox']");
    const label = li.querySelector("label");
    tasks.push({
      text: label.textContent,
      completed: checkbox.checked,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTaskToDOM(task.text, task.completed);
  });
};


const addTaskToDOM = (taskText, completed = false) => {
  const li = document.createElement("li");

  const taskId = "task-" + Date.now() + Math.random(); 

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = taskId;
  checkbox.checked = completed;

  const label = document.createElement("label");
  label.setAttribute("for", taskId);
  label.textContent = taskText;

  li.appendChild(checkbox);
  li.appendChild(label);

  taskList.appendChild(li);

  updateTaskCount(); 
};

const addTask = (e) => {
  e.preventDefault();

  const taskText = input.value.trim();
  if (taskText === "") return;

  addTaskToDOM(taskText);
  saveTasks(); 

  input.value = "";
};


const setActiveButton = (button) => {
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
};

const filterTasks = (filter) => {
  currentFilter = filter;
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach((task) => {
    const checkbox = task.querySelector("input[type='checkbox']");
    if (
      filter === "all" ||
      (filter === "active" && !checkbox.checked) ||
      (filter === "completed" && checkbox.checked)
    ) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
  taskList.parentElement.classList.remove(
    "all-view",
    "active-view",
    "completed-view"
  );
  taskList.parentElement.classList.add(`${filter}-view`);
};


const deleteCompletedTasks = () => {
  const tasks = taskList.querySelectorAll("li");
  tasks.forEach((task) => {
    const checkbox = task.querySelector("input[type='checkbox']");
    if (checkbox.checked) {
      task.remove();
    }
  });
  saveTasks();
  updateTaskCount();
};


form.addEventListener("submit", addTask);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.textContent.toLowerCase();
    setActiveButton(button);
    filterTasks(filter);
  });
});

taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    saveTasks();
    filterTasks(currentFilter);
  }
});

deleteBtn.addEventListener("click", deleteCompletedTasks);

updateDate();
setActiveButton(filterButtons[0]);
filterTasks("all");
loadTasks();
updateTaskCount();
