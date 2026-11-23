import { AuthServices } from "../services/AuthServices";
import express, { Request, Response } from "express";
import * as yup from 'yup';
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email e senha são obrigatórios",
            });
            return;
        }

        const authServices = new AuthServices();

        const userData = await authServices.login(email, password);

        res.status(200).json({
            message: "Login realizado com sucesso",
            user: userData
        });
        return;

    }
    catch (error: any) {
        res.status(401).json({
            message: error.message || "Erro ao realizar login"
        });
        return;
    }
});

router.get("/validate-token", verifyToken, async (req: Request, res: Response) => {

    res.status(200).json({
        message: "Token válido",
        userId: (req as any).user.id
    })

})

router.post("/new-user", verifyToken, async (req: Request, res: Response) => {
    try {

        var data = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("O campo 'name' é obrigatório!").min(3, "O campo 'name' deve ter no mínimo 3 caracteres!"),
            email: yup.string().email("O campo 'email' deve ser um e-mail válido!").required("O campo 'email' é obrigatório!"),
            password: yup.string().required("O campo 'password' é obrigatório!").min(6, "O campo 'password' deve ter no mínimo 6 caracteres!"),
            situationId: yup.number().required("O campo 'situationId' é obrigatório!")
        });

        await schema.validate(data, { abortEarly: false });

        // const { name, email, situationId } = req.body;

        // if (!name || name.trim() === "") {
        //     res.status(400).json({ message: "O campo 'name' é obrigatório!" });
        //     return;
        // }

        // if (!email || email.trim() === "") {
        //     res.status(400).json({ message: "O campo 'email' é obrigatório!" });
        //     return;
        // }

        // if (!situationId) {
        //     res.status(400).json({ message: "O campo 'situationId' é obrigatório!" });
        //     return;
        // }

        const userRepository = AppDataSource.getRepository(Users);

        const existingUser = await userRepository.findOne({ where: { email: data.email } });

        if (existingUser) {
            res.status(400).json({ message: "Já existe um usuário cadastrado com esse e-mail! Escolha outro e-mail ou faça login com o e-mail já cadastrado." });
            return;
        }

        // const situationRepository = AppDataSource.getRepository(Situation);

        // const newUser = userRepository.create(data);

        // Verificar se a situação informada existe
        // const situationExists = await situationRepository.findOne({ where: { id: Number(situationId) } });
        // if (!situationExists) {
        //     res.status(400).json({ message: "A situação informada não existe!" });
        //     return;
        // }

        // Verificar se o e-mail já está cadastrado
        // const existingUser = await userRepository.findOne({ where: { email } });
        // if (existingUser) {
        //     res.status(400).json({ message: "Já existe um usuário cadastrado com esse e-mail! Atualize-o com o método PUT ou escolha outro e-mail." });
        //     return;
        // }

        // const newUser = userRepository.create({
        //     name,
        //     email,
        //     situation: situationExists
        // });

        //data.password = await bcrypt.hash(data.password, 10);

        const newUser = userRepository.create(data);

        await userRepository.save(newUser);

        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            situation: newUser
        });
    }
    catch (error) {

        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao cadastrar usuário!"
        });
    }
});

router.post("/recover-password", async (req: Request, res: Response) => {

    try {

        var data = req.body;

        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("O campo 'urlRecoverPassword' é obrigatório"),
            email: yup.string().email("Email inválido").required("O campo 'email' é obrigatório"),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOneBy({

            email: data.email

        });

        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado"
            });
            return;
        }

        user.recoverPassword = crypto.randomBytes(32).toString("hex");

        await userRepository.save(user);


        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        var message_content = {
            from: process.env.EMAIL_FROM, // sender address
            to: data.email, // list of recipients
            subject: "Recuperar senha", // subject line

            text: `Prezado(a) ${user.name}\n\n
            Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.\n\n
            Clique ou copie o link para criar uma nova senha em nosso sistema:
            ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}\n\n
            Esta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\n
            Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
            Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
            o preenchimento de senhas e informações cadastrais.\n\n`, // Conteúdo do e-mail somente texto

            html: `Prezado(a) ${user.name}<br><br>
            Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>
            Clique no link para criar uma nova senha em nosso sistema:
            <a href='${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}'>${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}</a><br><br>
            Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>
            Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
            Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>`,
        }

        transporter.sendMail(message_content, function (err) {
            if (err) {
                console.log("Erro ao enviar email: ", err);
                res.status(200).json({
                    message: `E-mail não enviado, tente novamente ou contate  ${process.env.EMAIL_ADM}`,
                });
                return;
            } else {
                res.status(200).json({
                    message: "E-mail enviado, verifique sua caixa de entrada.",
                    urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                });
                return;
            }
        });
    }




    //     res.status(200).json({
    //     message: "Gerado o link para recuperar a senha.",
    //     urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
    //     key: user.recoverPassword
    // }

    catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao recuperar senha"
        });
    }
});

router.post("/validate-recover-password", async (req: Request, res: Response) => {

    try {

        var data = req.body;

        const schema = yup.object().shape({
            recoverPassword: yup.string().required("O campo 'recoverPassword' é obrigatório"),
            email: yup.string().email("Email inválido").required("O campo 'email' é obrigatório"),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOneBy({

            email: data.email,
            recoverPassword: data.recoverPassword

        });

        if (!user) {
            res.status(404).json({
                message: "A chave de recuperação de senha é inválida"
            });
            return;
        }

        res.status(200).json({
            message: "A chave de recuperar a senha é válida",
        });
        return;

    }
    catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao recuperar senha"
        });
    }
});

router.put("/update-password", async (req: Request, res: Response) => {

    try {

        var data = req.body;

        const schema = yup.object().shape({
            recoverPassword: yup.string().required("O campo 'recoverPassword' é obrigatório"),
            password: yup.string().required("O campo 'password' é obrigatório!").min(6, "O campo 'password' deve ter no mínimo 6 caracteres!"),
            email: yup.string().email("Email inválido").required("O campo 'email' é obrigatório"),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(Users);

        const user = await userRepository.findOneBy({

            email: data.email,
            recoverPassword: data.recoverPassword

        });

        if (!user) {
            res.status(404).json({
                message: "A chave de recuperação de senha é inválida"
            });
            return;
        }


        data.recoverPassword = null

        userRepository.merge(user, data)

        await userRepository.save(user);

        res.status(200).json({
            message: "Senha atualizada com sucesso"
        });
        return;


    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao recuperar senha"
        });
    }
});

export default router;