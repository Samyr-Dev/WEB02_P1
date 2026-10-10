"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const SituationsController_1 = __importDefault(require("./controllers/SituationsController"));
const ProductCategoryController_1 = __importDefault(require("./controllers/ProductCategoryController"));
const ProductSituationController_1 = __importDefault(require("./controllers/ProductSituationController"));
const UsersController_1 = __importDefault(require("./controllers/UsersController"));
const ProductController_1 = __importDefault(require("./controllers/ProductController"));
app.use("/", AuthController_1.default);
app.use("/", ProductCategoryController_1.default);
app.use("/", SituationsController_1.default);
app.use("/", ProductSituationController_1.default);
app.use("/", UsersController_1.default);
app.use("/", ProductController_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Acesse: http://localhost:${process.env.PORT}`);
});
