"use client"; // Required for useRouter in App Router

import { hydrateRoot } from 'react-dom/client';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/signup");
  }
  const handleLogin = () => {
    router.push("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to My App</h1>

      {/* Login Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all w-full"
        >
          Login
        </button>
      </div>

      <p className="mt-4">Don't have an account?</p>
      <button
        onClick={handleSignup}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-all mt-2"
      >
        Go to Signup
      </button>
    </div>
  );
}

