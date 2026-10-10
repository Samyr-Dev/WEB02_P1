import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Situation } from "../entity/Situation";
import { PaginationService } from "../services/PaginationServices";

const router = express.Router();

// Buscar lista de todos os usuários cadastrados com paginação
router.get("/users", async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(Users);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const result = await PaginationService.paginate(userRepository, page, limit, { id: "DESC" });

        res.status(200).json(result);
        return;
    }
    catch (error: any) {
        res.status(400).json({
            error: true,
            message: error.message || "Erro ao buscar usuários!"
        });
        return;
    }
});

// Buscar usuário por ID (trazendo os dados da situação vinculada)
router.get("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOne({
            where: { id: Number(id) },
            relations: {
                situation: true
            }
        });

        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado com o ID fornecido!"
            });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao listar usuário!"
        });
    }
});

// Criar novo usuário
router.post("/users", async (req: Request, res: Response) => {
    try {
        const { name, email, situationId } = req.body;

        if (!name || name.trim() === "") {
            res.status(400).json({ message: "O campo 'name' é obrigatório!" });
            return;
        }

        if (!email || email.trim() === "") {
            res.status(400).json({ message: "O campo 'email' é obrigatório!" });
            return;
        }

        if (!situationId) {
            res.status(400).json({ message: "O campo 'situationId' é obrigatório!" });
            return;
        }

        const userRepository = AppDataSource.getRepository(Users);
        const situationRepository = AppDataSource.getRepository(Situation);

        // Verificar se a situação informada existe
        const situationExists = await situationRepository.findOne({ where: { id: Number(situationId) } });
        if (!situationExists) {
            res.status(400).json({ message: "A situação informada não existe!" });
            return;
        }

        // Verificar se o e-mail já está cadastrado
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Já existe um usuário cadastrado com esse e-mail! Atualize-o com o método PUT ou escolha outro e-mail." });
            return;
        }

        const newUser = userRepository.create({
            name,
            email,
            situation: situationExists
        });

        await userRepository.save(newUser);

        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            user: newUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao cadastrar usuário!"
        });
    }
});

// Atualizar usuário
router.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, situationId } = req.body;

        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" });
            return;
        }

        if (email) {
            const existingEmail = await userRepository.findOne({ where: { email } });
            if (existingEmail && existingEmail.id !== Number(id)) {
                res.status(400).json({ message: "Já existe outro usuário cadastrado com esse e-mail!" });
                return;
            }
        }

        if (situationId) {
            const situationRepository = AppDataSource.getRepository(Situation);
            const situationExists = await situationRepository.findOne({ where: { id: Number(situationId) } });
            if (!situationExists) {
                res.status(400).json({ message: "A situação informada não existe!" });
                return;
            }
            user.situation = situationExists;
        }

        if (name) user.name = name;
        if (email) user.email = email;

        const updatedUser = await userRepository.save(user);

        res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar usuário!"
        });
    }
});

// Remover usuário
router.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userRepository = AppDataSource.getRepository(Users);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" });
            return;
        }

        await userRepository.remove(user);

        res.status(200).json({
            message: "Usuário excluído com sucesso!"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erro ao remover usuário!"
        });
    }
});

export default router;