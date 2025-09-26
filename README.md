# Multi-User Todo API

A simple Flask-based REST API for managing todos with persistent storage in a JSON file.
Supports multiple users (each with their own task list) and basic CRUD operations.

The Group members are: Mercy Yankey, Saidamir Osimov, Osen Mac-Iriase and Aayush Rajak.

The goal is to create a task management system that can be accessed from the LLM with **Model Context Protocol (MCP)**


## Features
- Create, read, update, and delete tasks
- User-based task separation (/tasks/<user_id>)
- Persistent storage using a JSON file (tasks.json)
- Lightweight and easy to run locally

## Structure
todo-api/
│── app.py              # Flask API
│── tasks.json          # Stores all tasks 
│── README.md           # Project documentation
│── todo_mcp_server.py  # MCP Server 


## Installation
1. Clone the repository:
```bash
   git https://github.com/osimmov/to-do-list.git
   cd to-do-list
```
2. Download Claude for Desktop

3. After downloading Claude, find the following file with Cmd/Ctrl + Shift + G:
~/Library/Application Support/Claude/claude_desktop_config.json

4. Open that file and put the following:
```bash
{
  "mcpServers": {
    "todo-server": {
      "command": "python3", #or just python depending on the version
      "args": ["/Users/Path_to_the_mcp_server/to-do-list/todo_mcp_server.py"] #Put the absolute path to your todo_mcp_server.py file
    }
  }
}
```
5. Start the servers:
```bash
    python3 app.py
```
6. In a new terminal run:
```bash
    python3 todo_mcp_server.py
```
7. Restart Claude

8. If you click on the "Search and Tools" button you should now be able to see the todo server and the commands that you can use

9. You can add delete update list the tasks from the chat.

10. Before giving any commands always mention the username, for who this task is.

The API will be running at:
👉 http://127.0.0.1:5000

11. Run the todo_mcp_server.py with python3 command

12. Go to Claude and start testing the to do list(add, delete, update tasks)


## JSON
Claude is going to save all the tasks for the users in a JSON file called tasks.json
Tasks look something like this:
```bash
 "Aayush": [
    {
      "id": 1,
      "title": "do hw",
      "due": "today",
      "completed": true
    }
  ]
```




