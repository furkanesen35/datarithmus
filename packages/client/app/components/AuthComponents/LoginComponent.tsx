import React, { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginComponent() {
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        login(email, data.token); // Pass token to context
        console.log("Login success:", data);
      } else {
        console.error("Login failed:", data.error);
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Unchanged form */} </form>
  );
}