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
const express_1 = __importDefault(require("express"));
const virhekasittelija_1 = require("../errors/virhekasittelija");
const prisma = new client_1.PrismaClient();
const apiJasenetRouter = express_1.default.Router();
apiJasenetRouter.use(express_1.default.json());
apiJasenetRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jasenet = yield prisma.jasen.findMany({
            select: {
                jasen_id: true,
                jasen_nimi: true,
            }
        });
        res.json(jasenet);
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiJasenetRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = Number(req.params.id);
        if (!isNaN(id)) {
            let tehtavaData = yield prisma.tehtava.findUnique({
                where: { tehtava_id: id },
                include: {
                    tehtava_jasen: {
                        include: {
                            jasen: {
                                select: {
                                    jasen_id: true,
                                    jasen_nimi: true,
                                }
                            },
                        },
                    },
                },
            });
            res.json(tehtavaData);
        }
        else {
            next(new virhekasittelija_1.Virhe(400, "Virheellinen id"));
        }
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
exports.default = apiJasenetRouter;
