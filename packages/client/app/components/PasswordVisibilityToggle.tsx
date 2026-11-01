interface PasswordVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export default function PasswordVisibilityToggle({
  visible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
    >
      {visible ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4 9.5 7-.4 1.2-1.2 2.4-2.3 3.4M6.2 6.2C4.1 7.5 2.9 9.5 2.5 12c1 3 4.5 7 9.5 7 1.1 0 2.2-.2 3.2-.6"
          />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}
