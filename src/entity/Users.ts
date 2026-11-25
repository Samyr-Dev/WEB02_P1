import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeUpdate, BeforeInsert } from "typeorm"
import { Situation } from "./Situation"
import bcrypt from "bcryptjs";


@Entity("users")
export class Users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    recoverPassword!: string;

    @ManyToOne(() => Situation, (situation) => situation)
    @JoinColumn({ name: "situationId" })
    situation!: Situation;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void>{
        //Só criptografa se a senha ainda não estiver criptografada, pois ao editar o usuário ela era criptografada de novo
        if (this.password && !this.password.startsWith("$2")){
            this.password = await bcrypt.hash(this.password, 10)
        }
    }

    //Remove a senha e a chave de recuperação das respostas da API
    toJSON() {
        const { password, recoverPassword, ...user } = this;
        return user;
    }



    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

}