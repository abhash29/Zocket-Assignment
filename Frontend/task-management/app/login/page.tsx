"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const credentials = btoa(`${formData.username}:${formData.password}`);

            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${credentials}`, // Send credentials securely
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Incorrect username or password");

            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-200">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
                        Login
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}
