from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

TASKS_FILE = "tasks.json"

# Load tasks from file
def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, "r") as f:
            return json.load(f)
    return {}

# Save tasks to file
def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)

# Get all tasks for a user
@app.route("/tasks/<user_id>", methods=["GET"])
def get_tasks(user_id):
    tasks = load_tasks()
    return jsonify(tasks.get(user_id, []))

# Create a new task
@app.route("/tasks/<user_id>", methods=["POST"])
def add_task(user_id):
    data = request.json
    tasks = load_tasks()

    user_tasks = tasks.get(user_id, [])
    task = {
        "id": len(user_tasks) + 1,
        "title": data.get("title"),
        "due": data.get("due"),
        "completed": False
    }
    user_tasks.append(task)
    tasks[user_id] = user_tasks
    save_tasks(tasks)
    return jsonify(task), 201

# Update a task
@app.route("/tasks/<user_id>/<int:task_id>", methods=["PUT"])
def update_task(user_id, task_id):
    data = request.json
    tasks = load_tasks()

    if user_id not in tasks:
        return jsonify({"error": "User not found"}), 404

    for task in tasks[user_id]:
        if task["id"] == task_id:
            task["title"] = data.get("title", task["title"])
            task["due"] = data.get("due", task["due"])
            task["completed"] = data.get("completed", task["completed"])
            save_tasks(tasks)
            return jsonify(task)

    return jsonify({"error": "Task not found"}), 404

# Delete a task
@app.route("/tasks/<user_id>/<int:task_id>", methods=["DELETE"])
def delete_task(user_id, task_id):
    tasks = load_tasks()

    if user_id not in tasks:
        return jsonify({"error": "User not found"}), 404

    tasks[user_id] = [t for t in tasks[user_id] if t["id"] != task_id]
    save_tasks(tasks)
    return jsonify({"status": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)
