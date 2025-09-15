(function (global) {
    const STORAGE_KEY = "todo.tasks.v1";
  
    const storage = {
      async load() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      },
      async save(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      },
    };
  
    let tasks = [];
    let el = {};
  
    const uid = () =>
      (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random());
  
    function isoStartOfDay(dateStr) {
      return dateStr ? new Date(dateStr + "T00:00:00").toISOString() : undefined;
    }
  
    async function addTask(title, dueStr) {
      const t = {
        id: uid(),
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        dueAt: isoStartOfDay(dueStr),
        completedAt: undefined,
      };
      tasks.push(t);
      await storage.save(tasks);
      render();
    }
  
    async function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      await storage.save(tasks);
      render();
    }
  
    async function toggleTask(id) {
      tasks = tasks.map(t => t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
        : t
      );
      await storage.save(tasks);
      render();
    }
  
    function filtered() {
      const f = el.filter?.value || "all";
      if (f === "active") return tasks.filter(t => !t.completed);
      if (f === "completed") return tasks.filter(t => t.completed);
      return tasks;
    }
  
    function formatMeta(t) {
      const parts = [];
      if (t.dueAt) {
        const due = new Date(t.dueAt);
        const today = new Date();
        const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const overdue = due < midnight && !t.completed;
        parts.push(`${overdue ? "Overdue" : "Due"}: ${due.toLocaleDateString()}`);
      }
      if (t.completedAt) parts.push(`Completed: ${new Date(t.completedAt).toLocaleString()}`);
      return parts.join(" • ");
    }
  
    function render() {
      el.list.innerHTML = "";
      for (const t of filtered()) {
        const node = el.template?.content?.firstElementChild?.cloneNode(true) ?? (() => {
          const li = document.createElement("li");
          li.className = "task";
          li.innerHTML = `
            <label><input class="toggle" type="checkbox" /><span class="title"></span></label>
            <span class="meta"></span>
            <button class="delete">🗑</button>`;
          return li;
        })();
  
        const checkbox = node.querySelector(".toggle");
        const title = node.querySelector(".title");
        const meta = node.querySelector(".meta");
        const del = node.querySelector(".delete");
  
        checkbox.checked = t.completed;
        title.textContent = t.title;
        title.classList.toggle("completed", t.completed);
        meta.textContent = formatMeta(t);
  
        checkbox.addEventListener("change", () => toggleTask(t.id));
        del.addEventListener("click", () => deleteTask(t.id));
  
        el.list.appendChild(node);
      }
    }
  
    async function initTaskApp({
        inputSelector = "#task-input",
        addBtnSelector = "#add-btn",
        filterSelector = "#filter",
        listSelector = "#task-list",
        templateSelector = "#task-item-template",
        dueSelector = "#task-due",
        onReady,
      } = {}) {
        el.input = document.querySelector(inputSelector);
        el.addBtn = document.querySelector(addBtnSelector);
        el.filter = document.querySelector(filterSelector);
        el.list = document.querySelector(listSelector);
        el.template = document.querySelector(templateSelector);
        el.due = document.querySelector(dueSelector);
      
        el.form = document.getElementById("new-task-form");
        el.form.addEventListener("submit", (e) => {
          e.preventDefault();
          const title = el.input.value || "";
          if (!title.trim()) return;
          addTask(title, el.due?.value);
          el.input.value = "";
          if (el.due) el.due.value = "";
          el.input.focus();
        });
      
        el.addBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const title = el.input.value || "";
          if (!title.trim()) return;
          addTask(title, el.due?.value);
          el.input.value = "";
          if (el.due) el.due.value = "";
          el.input.focus();
        });
      
        el.filter?.addEventListener("change", render);
      
        tasks = await storage.load();
        render();
        onReady && onReady({ addTask, deleteTask, toggleTask });
      }
      global.TaskApp = { init: initTaskApp, addTask, deleteTask, toggleTask };
    })(window);
     