
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send('Olá, Mundo! Tela de login da rota');
});


export default router;