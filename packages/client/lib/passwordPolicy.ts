export const PASSWORD_REQUIREMENTS = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
  },
  {
    label: 'At least one uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: 'At least one lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: 'At least one number',
    test: (password: string) => /[0-9]/.test(password),
  },
] as const;

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every(({ test }) => test(password));
}
