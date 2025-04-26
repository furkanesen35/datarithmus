"use client"
import LoginComponent from "app/components/AuthComponents/LoginComponent";

export default function Page() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#301934]">
      <div className="w-[90%] max-w-[400px] bg-gray-50 rounded-[10px] p-[30px]">
          <LoginComponent/>
      </div>
    </div>
  );
}