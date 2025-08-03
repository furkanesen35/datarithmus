// packages/client/lib/googleMeet.ts

// Simple Google Meet link generator
export function generateGoogleMeetLink(): string {
  // Generate a random meeting ID (10 characters)
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const segments: string[] = [];
  
  // Generate 3 segments of 3-4 characters each (xxx-xxxx-xxx format)
  for (let i = 0; i < 3; i++) {
    let segment = '';
    const length = i === 1 ? 4 : 3; // Middle segment is 4 chars, others are 3
    for (let j = 0; j < length; j++) {
      segment += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    segments.push(segment);
  }
  
  return `https://meet.google.com/${segments.join('-')}`;
}

// Function to create calendar event data for email
export function createCalendarEventData(
  title: string,
  startDateTime: Date,
  endDateTime: Date,
  googleMeetLink: string,
  description?: string
) {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return {
    title,
    start: formatDate(startDateTime),
    end: formatDate(endDateTime),
    description: description || '',
    location: googleMeetLink,
    url: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDateTime)}/${formatDate(endDateTime)}&details=${encodeURIComponent(description || '')}&location=${encodeURIComponent(googleMeetLink)}`,
  };
}
