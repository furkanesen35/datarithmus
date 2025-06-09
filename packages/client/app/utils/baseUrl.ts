// packages/client/app/utils/baseUrl.ts
export function getBaseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000';
}
