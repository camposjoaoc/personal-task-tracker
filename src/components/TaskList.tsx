import { useState, ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faCheck, faEraser } from "@fortawesome/free-solid-svg-icons";
import type { TaskItem } from "../types/types";

function TaskList() {
    const [newTodoTask, setNewTodoTask] = useState<TaskItem>({ text: "" });
    const [todoTaskList, setTodoTaskList] = useState<TaskItem[]>([]);
    const [doneTaskList, setDoneTaskList] = useState<TaskItem[]>([]);
    const [isRemoval, setRemoval] = useState<boolean>(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedTaskText, setEditedTaskText] = useState<string>("");

    // Load tasks from localStorage when the component mounts
    useEffect(() => {
        const savedTasks = localStorage.getItem("todoTaskList");
        const savedDoneTasks = localStorage.getItem("doneTaskList");

        if (savedTasks) {
            setTodoTaskList(JSON.parse(savedTasks));
        }

        if (savedDoneTasks) {
            setDoneTaskList(JSON.parse(savedDoneTasks));
        }
    }, []);

    // Update localStorage
    useEffect(() => {
        if (todoTaskList.length > 0 || isRemoval === true) { // Avoid setting empty list
            localStorage.setItem("todoTaskList", JSON.stringify(todoTaskList));
            setRemoval(false);
        }

        if (doneTaskList.length > 0 || isRemoval === true) { // Avoid setting empty list
            localStorage.setItem("doneTaskList", JSON.stringify(doneTaskList));
            setRemoval(false);
        }
    }, [todoTaskList, doneTaskList, isRemoval]);

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
    function removeTask(index: number) {
        const updatedTasks = todoTaskList.filter((_, i) => i !== index);
        setTodoTaskList(updatedTasks);
        setRemoval(true);
    }

    // Mark the task as Done and Move to another array
    function moveToDoneTask(index: number) {
        const taskToMove = todoTaskList[index];
        const doneTempTasks: TaskItem[] = [...doneTaskList, taskToMove];
        setDoneTaskList(doneTempTasks);
        removeTask(index);
    }

    // Remover all done tasks
    const clearDoneTasks = () => {
        setDoneTaskList([]);
        setRemoval(true);
    };

    // Edit a task
    const startEditing = (index: number, text: string) => {
        setEditingIndex(index);
        setEditedTaskText(text);
    };

    const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedTaskText(e.target.value);
    };

    const saveEditedTask = (index: number) => {
        const updatedTasks = [...todoTaskList];
        updatedTasks[index] = { text: editedTaskText };
        setTodoTaskList(updatedTasks);
        setEditingIndex(null);
    };

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10 w-400">
            <h1 className="text-2xl font-bold mb-6">Personal Task Manager</h1>
            <div className="w-full max-w-md bg-white p-5 rounded-lg shadow-md">
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
                        placeholder="Describe the task..."
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
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            value={editedTaskText}
                                            onChange={handleEditChange}
                                            className="flex-1 p-2 border rounded-lg"
                                        />
                                    ) : (
                                        <span className="w-full text-justify">{todo.text}</span>
                                    )}
                                    <div className="flex m-1 p-1 w-30 space-x-2">
                                        {editingIndex === index ? (
                                            <button
                                                onClick={() => saveEditedTask(index)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(index, todo.text)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeTask(index)}
                                            disabled={editingIndex === index}
                                            className={`px-4 py-2 rounded-lg flex items-center ${editingIndex === index ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button
                                            onClick={() => moveToDoneTask(index)}
                                            disabled={editingIndex === index}
                                            className={`px-4 py-2 rounded-lg flex items-center ${editingIndex === index ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center m-5">No tasks added yet.</p>
                    )}
                </div>
            </div>
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-4">
                <h2 className="text-2xl font-bold mb-6">Done Tasks</h2>
                {doneTaskList.length > 0 ? (
                    <div className="flex flex-col items-left">
                        <ul className="space-y-2">
                            {doneTaskList.map((todo: TaskItem, index: number) => (
                                <li key={index} className="flex justify-between items-center p-2 border-b">
                                    <span className="w-full text-justify">{todo.text}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={clearDoneTasks}
                            className="bg-yellow-300 text-white hover:bg-yellow-400 border border-yellow-500 px-2 py-1 text-sm rounded-md mx-auto block mt-5">
                            Erase Tasks <FontAwesomeIcon icon={faEraser} />
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center m-5">No tasks done yet.</p>
                )}

            </div>
        </main>

    );
}
export default TaskList;