from mcp.server.fastmcp import FastMCP
import requests

mcp = FastMCP("ToDo MCP Server")

BASE_URL = "http://127.0.0.1:5000"  # Flask backend

def safe_response(response):
    try:
        return response.json()
    except Exception:
        return {"error": response.text, "status_code": response.status_code}

# List tasks
@mcp.tool(title="List Tasks")
def list_tasks(user_id: str):
    try:
        response = requests.get(f"{BASE_URL}/tasks/{user_id}")
        return safe_response(response)
    except Exception as e:
        return {"error": str(e)}

# Add task
@mcp.tool(title="Add Task")
def add_task(user_id: str, title: str, due: str = ""):
    try:
        response = requests.post(
            f"{BASE_URL}/tasks/{user_id}",
            json={"title": title, "due": due}
        )
        return safe_response(response)
    except Exception as e:
        return {"error": str(e)}

# Update task
@mcp.tool(title="Update Task")
def update_task(user_id: str, task_id: int, title: str = None, due: str = None, completed: bool = None):
    data = {}
    if title is not None: data["title"] = title
    if due is not None: data["due"] = due
    if completed is not None: data["completed"] = completed

    try:
        response = requests.put(f"{BASE_URL}/tasks/{user_id}/{task_id}", json=data)
        return safe_response(response)
    except Exception as e:
        return {"error": str(e)}

# Delete task
@mcp.tool(title="Delete Task")
def delete_task(user_id: str, task_id: int):
    try:
        response = requests.delete(f"{BASE_URL}/tasks/{user_id}/{task_id}")
        return safe_response(response)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    mcp.run()
