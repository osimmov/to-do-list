from mcp.server.fastmcp import FastMCP
import requests

mcp = FastMCP("ToDo MCP Server")

BASE_URL = "http://127.0.0.1:5000"  # Flask backend

# List tasks
@mcp.tool(title="List Tasks")
def list_tasks():
    response = requests.get(f"{BASE_URL}/tasks")
    return response.json()

# Add task
@mcp.tool(title="Add Task")
def add_task(title: str, due: str = ""):
    response = requests.post(
        f"{BASE_URL}/tasks",
        json={"title": title, "due": due}
    )
    return response.json()

# Update task (toggle or edit)
@mcp.tool(title="Update Task")
def update_task(task_id: int, title: str = None, due: str = None, completed: bool = None):
    data = {}
    if title is not None: data["title"] = title
    if due is not None: data["due"] = due
    if completed is not None: data["completed"] = completed

    response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=data)
    if response.status_code == 404:
        return {"error": "Task not found"}
    return response.json()

# Delete task
@mcp.tool(title="Delete Task")
def delete_task(task_id: int):
    response = requests.delete(f"{BASE_URL}/tasks/{task_id}")
    return {"status": "deleted" if response.status_code == 200 else "error"}

if __name__ == "__main__":
    mcp.run()
