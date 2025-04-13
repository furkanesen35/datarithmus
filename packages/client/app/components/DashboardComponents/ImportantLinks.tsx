export default function ImportantLinks() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Important Links</h1>
        <p>Useful resources for your learning journey.</p>
        <ul className="list-disc pl-5">
          <li>
            <a href="https://docs.google.com" className="text-blue-500 hover:underline">
              Course Materials
            </a>
          </li>
          <li>
            <a href="https://slack.com" className="text-blue-500 hover:underline">
              Community Slack
            </a>
          </li>
        </ul>
      </div>
    );
  }