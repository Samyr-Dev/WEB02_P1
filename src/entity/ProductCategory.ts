import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("product_categories")
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true })
    nameProductCategories!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}