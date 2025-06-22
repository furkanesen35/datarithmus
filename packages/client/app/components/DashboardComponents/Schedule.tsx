// packages/client/app/components/DashboardComponents/Schedule.tsx
import AppointmentRequestForm from './AppointmentRequestForm';
import StudentAppointments from './StudentAppointments';
import { useState } from 'react';

export default function Schedule() {
	const [showForm, setShowForm] = useState(false);
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Schedule</h1>
			<button
				className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
				onClick={() => setShowForm((v) => !v)}
			>
				{showForm ? 'Hide Appointment Form' : 'Request New Appointment'}
			</button>
			{showForm && (
				<AppointmentRequestForm
					onRequestSuccess={() => setShowForm(false)}
				/>
			)}
			<StudentAppointments />
			<h3 className="text-lg font-bold mb-2">
				Your upcoming classes and events
			</h3>
			<ul className="list-disc pl-5">
				<li>Mon, 10 AM: Data Science Live Session</li>
				<li>Wed, 2 PM: Python Workshop</li>
			</ul>
		</div>
	);
}
