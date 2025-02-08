import { useState, ChangeEvent, useEffect } from "react";
import type { TaskItem } from "../types/types";

function TaskList() {
    const [newTodoTask, setNewTodoTask] = useState<TaskItem>({ text: "" });
    const [todoTaskList, setTodoTaskList] = useState<TaskItem[]>([]);

    // Load tasks from localStorage when the component mounts
    useEffect(() => {
        const savedTasks = localStorage.getItem("todoTaskList");
        if (savedTasks) {
            setTodoTaskList(JSON.parse(savedTasks));
        }
    }, []);

    // Update localStorage
    useEffect(() => {
        localStorage.setItem("todoTaskList", JSON.stringify(todoTaskList));
    }, [todoTaskList]);

    // Update the state for the new task
    const handleNewTodoTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTodoTask({ text: e.target.value });
    };

    // Add a new task
    function addNewTodoTask() {
        if (newTodoTask.text.trim() === "") return;
        const updatedTasks = [...todoTaskList, newTodoTask];
        setTodoTaskList(updatedTasks);
        setNewTodoTask({ text: "" });
    }

    // Remove a task
    function removeTodo(index: number) {
        const updatedTasks = todoTaskList.filter((_, i) => i !== index);
        setTodoTaskList(updatedTasks);
    }
    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-2xl font-bold mb-6">Personal Task Manager</h1>
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        addNewTodoTask();
                    }}
                    className="flex space-x-2 mb-4"
                >
                    <input
                        value={newTodoTask.text}
                        type="text"
                        placeholder="Describe the task"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewTodoTaskChange(e)}
                        className="flex-1 p-2 border rounded-lg "
                    />

                </form>
                <button
                    type="submit"
                    onClick={addNewTodoTask}
                    className="bg-[rgb(59,188,168)] hover:bg-[rgb(45,160,145)]  text-white px-4 py-2 rounded-lg w-full max-w-md"
                >
                    Add Task
                </button>
                <div>
                    {todoTaskList.length > 0 ? (
                        <ul className="space-y-2">
                            {todoTaskList.map((todo: TaskItem, index: number) => (
                                <li key={index} className="flex justify-between items-center p-2 border-b">
                                    <span>{todo.text}</span>
                                    <button
                                        onClick={() => removeTodo(index)}
                                        aria-label={`Remove task ${todo.text}`}
                                        className="bg-red-600 text-white hover:bg-red-800 border border-red-700 px-4 py-2 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center m-5">No tasks added yet.</p>
                    )}
                </div>
            </div>
        </main>

    );
}
export default TaskList;