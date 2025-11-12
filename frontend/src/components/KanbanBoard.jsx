import React, {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {io} from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || "http://localhost:3001";

const API_URL = `${BACKEND_URL}/api/tasks`;

const socket = io(REALTIME_URL);

const columns = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

export default function KanbanBoard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setTasks(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("Error fetching tasks:", err);
                setTasks([]);
            });

        socket.on("task-updated", (updatedTask) => {
            console.log("Received update:", updatedTask);
            setTasks((prev) =>
                prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
        });

        return () => socket.off("task-updated");
    }, []);

    const updateTaskStatus = async (task) => {
        try {
            await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(task),
            });

            socket.emit("task-updated", task);
        } catch (e) {
            console.error("Error updating task:", e);
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const {draggableId, destination} = result;

        const updatedTasks = tasks.map((task) => {
            if (task.id.toString() === draggableId) {
                const updated = {...task, status: destination.droppableId};
                updateTaskStatus(updated);
                return updated;
            }
            return task;
        });

        setTasks(updatedTasks);
    };

    const handleCreateTask = async () => {
        const title = prompt("Enter task title:");
        if (!title) return;
        const newTask = {title, description: "", status: "TODO"};
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newTask),
        });
        const saved = await res.json();
        setTasks([...tasks, saved]);
    };

    return (
        <div className="kanban-board">
            <h1>Kanban Board</h1>
            <button onClick={handleCreateTask} className="add-task">
                + Add Task
            </button>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-columns">
                    {Object.keys(columns).map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div
                                    className="kanban-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2>{columns[status]}</h2>
                                    {tasks
                                        .filter((t) => t.status === status)
                                        .map((task, index) => (
                                            <Draggable
                                                key={task.id.toString()}
                                                draggableId={task.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="kanban-task"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <strong>{task.title}</strong>
                                                        <p>{task.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
