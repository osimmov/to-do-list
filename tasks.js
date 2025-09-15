const TaskApp = (() => {
  let taskList, form, input, dueInput, filter;
  let tasks = [];
  
  function loadTasks() {
    const saved = localStorage.getItem("tasks");
    tasks = saved ? JSON.parse(saved) : [];
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

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

      if (task.completed) {
        checkbox.checked = true;
        title.classList.add("completed");
      }

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        render();
      });

      delBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        render();
      });

      taskList.appendChild(li);
    });
  }

  function addTask(title, due) {
    const newTask = {
      id: Date.now(),
      title,
      due,
      completed: false
    };
    tasks.push(newTask);
    saveTasks();
    render();
  }

  function init() {
    taskList = document.getElementById("task-list");
    form = document.getElementById("new-task-form");
    input = document.getElementById("task-input");
    dueInput = document.getElementById("task-due");
    filter = document.getElementById("filter");

    loadTasks();
    render();

    form.addEventListener("submit", e => {
      e.preventDefault();
      const title = input.value.trim();
      if (!title) return;

      addTask(title, dueInput.value);
      input.value = "";
      dueInput.value = "";
    });

    filter.addEventListener("change", render);
  }

  return { init };
})();
