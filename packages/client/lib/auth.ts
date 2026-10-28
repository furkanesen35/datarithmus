import { jwtVerify, SignJWT } from 'jose';

export interface JwtPayload {
  email: string;
  isSuperuser: boolean;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required to sign or verify tokens.');
  }

  return new TextEncoder().encode(secret);
}

export function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    isSuperuser: payload.isSuperuser,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ['HS256'],
  });

  if (
    typeof payload.email !== 'string' ||
    typeof payload.isSuperuser !== 'boolean'
  ) {
    throw new Error('Invalid JWT payload.');
  }

  return {
    email: payload.email,
    isSuperuser: payload.isSuperuser,
  };
}
