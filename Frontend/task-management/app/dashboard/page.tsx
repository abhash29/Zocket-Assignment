'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    completed: boolean;
    priority: 'Low' | 'Medium' | 'High';
}


export default function DashboardPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [completed, setCompleted] = useState(false);
    const [priority, setPriority] = useState<Task["priority"]>("Medium");

    const [tasks, setTasks] = useState<Task[]>([]);
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const username = localStorage.getItem("username"); // Assuming username is stored
                if (!username) return router.push("/login"); // Redirect if not logged in

                const response = await fetch(`http://localhost:5000/tasks?username=${username}`);
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);


    return (
        <div className="min-h-screen bg-gray-100">
          <div>Dashboard</div>
            <div>Dashboard</div>
            <div>List of Tasks - Assigned</div>
            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
                <h2 className="text-lg font-semibold mb-2">Assigned Tasks</h2>
                <div className="space-y-4">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task.id} className="p-4 border rounded-lg shadow bg-white">
                                <h3 className="font-semibold">{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Deadline: {task.deadline}</p>
                                <p>Priority: {task.priority}</p>
                                <p>Status: {task.completed ? "✅ Completed" : "⏳ Pending"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tasks found.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        Enter Your Task Details
                    </h2>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                        />
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                        />
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={(e) => setCompleted(e.target.checked)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Completed</span>
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Task["priority"])}
                            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <button className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
