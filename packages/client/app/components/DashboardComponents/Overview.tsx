export default function Overview({ email }: { email?: string }) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome, {email}!</h1>
        <p>This is your dashboard overview. Check your courses or progress from the sidebar.</p>
      </div>
    );
  }