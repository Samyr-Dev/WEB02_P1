import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ProductCategory } from "./ProductCategory";
import { ProductSituation } from "./ProductSituation";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    nameProduct!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    @ManyToOne(() => ProductCategory, (category) => category.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productCategoryId" })
    productCategory!: ProductCategory;

    @ManyToOne(() => ProductSituation, (situation) => situation.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productSituationId" })
    productSituation!: ProductSituation;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}