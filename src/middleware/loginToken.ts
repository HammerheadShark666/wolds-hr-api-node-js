import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';  
import { LoginRequestExtension } from '../interface/login';

function verifyToken(token: string, secret: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
        return reject(new Error('Invalid token payload'));
      }

      resolve(decoded as JwtPayload);
    });
  });
}

export const loginToken = async (req: LoginRequestExtension, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);

    req.account = {
      userId: decoded.userId as string,
      iat: decoded.iat!,
      exp: decoded.exp!,
    };

    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
