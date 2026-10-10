import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("product_situations")
export class ProductSituation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true })
    nameProductSituations!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}