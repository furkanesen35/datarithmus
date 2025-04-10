"use client";
import { useState } from "react";
import LoginComponent from "../components/AuthComponents/LoginComponent";
import RegisterComponent from "../components/AuthComponents/RegisterComponent";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-[#301934] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col">
        {/* Tabs (Fixed at Top) */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 text-center ${activeTab === "login" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${activeTab === "register" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Content Area with Fixed Height */}
        <div className="flex-1 min-h-[300px]">
          {activeTab === "login" ? <LoginComponent /> : <RegisterComponent />}
        </div>
      </div>
    </div>
  );
}