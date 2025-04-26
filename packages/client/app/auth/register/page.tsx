// packages/client/app/auth/register/page.tsx
"use client"
import RegisterComponent from "app/components/AuthComponents/RegisterComponent";

export default function Page() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#301934]">
      <div className="w-[90%] max-w-[400px] bg-gray-50 rounded-[10px] p-[30px]">
          <RegisterComponent/>
      </div>
    </div>
  );
}