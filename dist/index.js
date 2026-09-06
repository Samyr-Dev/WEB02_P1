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
app.use("/", AuthController_1.default);
app.use("/", SituationsController_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Acesse: http://localhost:${process.env.PORT}`);
});
