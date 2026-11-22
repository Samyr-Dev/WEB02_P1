import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
    user?: { id: number };

}

/**
 * @param req - Objeto de requisição do Express
 * @param res - Objeto de resposta do Express
 * @param next - Função para passar para o próximo middleware
 */

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
        return;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer.toLocaleLowerCase() !== 'bearer' || !token) {
        res.status(401).json({ message: 'Token inválido' });
        return;
    }



    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

        req.user = { id: decoded.id };

        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}