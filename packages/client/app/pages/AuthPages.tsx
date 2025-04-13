"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginComponent from "../components/AuthComponents/LoginComponent";
import RegisterComponent from "../components/AuthComponents/RegisterComponent";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register" || tab === "login") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#301934]">
      <div className="w-[90%] max-w-[400px] bg-gray-50 rounded-[10px] p-[30px]">
        <button
          onClick={() => router.back()}
          className="text-[#301934] hover:underline mb-[20px]"
        >
          Back
        </button>
        <div className="flex justify-between mb-[30px] text-blue-900">
          <button
            className={`flex-1 p-[10px] font-semibold ${
              activeTab === "login"
                ? "border-b-2 border-[#66b3ff]"
                : "text-blue-500"
            }`}
            onClick={() => {
              setActiveTab("login");
              router.push("/auth?tab=login");
            }}
          >
            Login
          </button>
          <button
            className={`flex-1 p-[10px] font-semibold ${
              activeTab === "register"
                ? "border-b-2 border-[#66b3ff]"
                : "text-blue-500"
            }`}
            onClick={() => {
              setActiveTab("register");
              router.push("/auth?tab=register");
            }}
          >
            Register
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginComponent setActiveTab={setActiveTab} />
        ) : (
          <RegisterComponent setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}