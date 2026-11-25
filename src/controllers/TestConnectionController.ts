
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/test-connection", (req: Request, res: Response) => {
    res.status(200).json({message: 'Conexão com API realizada com sucesso!'});
});

//Aqui não tem necessidade do verifyToken


export default router;