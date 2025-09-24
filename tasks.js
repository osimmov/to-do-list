const TaskApp = (() => {
  let taskList, form, input, dueInput, filter;
  let tasks = [];

  const BASE_URL = "http://127.0.0.1:5000"; // Flask backend

  // Load tasks from backend
  async function loadTasks() {
    const res = await fetch(`${BASE_URL}/tasks`);
    tasks = await res.json();
  }

  // Save a new task to backend
  async function addTask(title, due) {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, due })
    });
    const newTask = await res.json();
    tasks.push(newTask);
    render();
  }

  // Update a task in backend
  async function toggleTask(task) {
    const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed })
    });
    const updated = await res.json();
    tasks = tasks.map(t => (t.id === updated.id ? updated : t));
    render();
  }

  // Delete task from backend
  async function deleteTask(taskId) {
    await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "DELETE"
    });
    tasks = tasks.filter(t => t.id !== taskId);
    render();
  }

  // Render tasks in the UI
  function render() {
    taskList.innerHTML = "";

    const filterValue = filter.value;
    let visibleTasks = tasks;

    if (filterValue === "active") {
      visibleTasks = tasks.filter(t => !t.completed);
    } else if (filterValue === "completed") {
      visibleTasks = tasks.filter(t => t.completed);
    }

    visibleTasks.forEach(task => {
      const template = document.getElementById("task-item-template");
      const li = template.content.cloneNode(true);

      const checkbox = li.querySelector(".toggle");
      const title = li.querySelector(".title");
      const meta = li.querySelector(".meta");
      const delBtn = li.querySelector(".delete");

      title.textContent = task.title;
      meta.textContent = task.due ? `Due: ${task.due}` : "";

      if (task.due && new Date(task.due) < new Date() && !task.completed) {
        meta.style.color = "red"; 
      } else {
        meta.style.color = ""; 
      }

      if (task.completed) {
        checkbox.checked = true;
        title.classList.add("completed");
      }

      checkbox.addEventListener("change", () => toggleTask(task));
      delBtn.addEventListener("click", () => deleteTask(task.id));

      taskList.appendChild(li);
    });
  }

  // Initialize app
  async function init() {
    taskList = document.getElementById("task-list");
    form = document.getElementById("new-task-form");
    input = document.getElementById("task-input");
    dueInput = document.getElementById("task-due");
    filter = document.getElementById("filter");

    await loadTasks();
    render();

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const title = input.value.trim();
      if (!title) return;

      await addTask(title, dueInput.value);
      input.value = "";
      dueInput.value = "";
    });

    filter.addEventListener("change", render);
  }

  return { init };
})();
