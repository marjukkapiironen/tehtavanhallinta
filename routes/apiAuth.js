"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const virhekasittelija_1 = require("../errors/virhekasittelija");
const apiAuthRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
apiAuthRouter.use(express_1.default.json());
apiAuthRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jasen = yield prisma.jasen.findFirst({
            where: {
                kayttajatunnus: req.body.kayttajatunnus
            }
        });
        if (req.body.kayttajatunnus === (jasen === null || jasen === void 0 ? void 0 : jasen.kayttajatunnus)) {
            let hash = crypto_1.default.createHash("SHA256").update(req.body.salasana).digest("hex");
            if (hash === (jasen === null || jasen === void 0 ? void 0 : jasen.salasana)) {
                let token = jsonwebtoken_1.default.sign({}, String(process.env.ACCESS_TOKEN_KEY));
                res.json({ token: token });
            }
            else {
                next(new virhekasittelija_1.Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }
        }
        else {
            next(new virhekasittelija_1.Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }
    }
    catch (_a) {
        next(new virhekasittelija_1.Virhe());
    }
}));
exports.default = apiAuthRouter;
