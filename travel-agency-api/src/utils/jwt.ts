import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export function generateToken(payload: object, expiresIn: string = '1d'): string {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] }; // 👈 顯式型別斷言
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}
