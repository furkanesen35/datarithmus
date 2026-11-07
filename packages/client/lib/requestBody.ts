export async function readJsonObject<T extends object>(
  req: Request,
): Promise<T | null> {
  let value: unknown;
  try {
    value = await req.json();
  } catch {
    return null;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as T;
}
