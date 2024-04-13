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
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const virhekasittelija_1 = require("../errors/virhekasittelija");
const prisma = new client_1.PrismaClient();
const apiTehtavatRouter = express_1.default.Router();
apiTehtavatRouter.use(express_1.default.json());
apiTehtavatRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tehtavat = yield prisma.tehtava.findMany({
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
                }
            }
        });
        res.json(tehtavat);
    }
    catch (e) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTehtavatRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
apiTehtavatRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tehtava_nimi, kuvaus, deadline, jasenet } = req.body;
        const uusiTehtava = yield prisma.tehtava.create({
            data: {
                tehtava_nimi: tehtava_nimi,
                kuvaus: (0, sanitize_html_1.default)(kuvaus),
                deadline: deadline,
                tehtava_jasen: {
                    create: jasenet.map((jasenId) => ({ jasen: { connect: { jasen_id: jasenId } } })),
                },
            },
            include: {
                tehtava_jasen: true,
            },
        });
        res.status(201).json(uusiTehtava);
    }
    catch (error) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTehtavatRouter.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tehtavaId = parseInt(req.params.id);
        const { tehtava_nimi, kuvaus, deadline, jasenet } = req.body;
        const paivitettyTehtava = yield prisma.tehtava.update({
            where: { tehtava_id: tehtavaId },
            data: {
                tehtava_nimi: tehtava_nimi,
                kuvaus: (0, sanitize_html_1.default)(kuvaus),
                deadline: deadline,
                tehtava_jasen: {
                    deleteMany: {},
                    create: jasenet.map((jasenId) => ({
                        jasen: { connect: { jasen_id: jasenId } },
                    })),
                },
            },
            include: {
                tehtava_jasen: true,
            },
        });
        res.status(200).json(paivitettyTehtava);
    }
    catch (error) {
        next(new virhekasittelija_1.Virhe());
    }
}));
apiTehtavatRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield prisma.tehtava.count({
        where: {
            tehtava_id: Number(req.params.id)
        }
    })) {
        try {
            yield prisma.tehtava.delete({
                where: {
                    tehtava_id: Number(req.params.id)
                }
            });
        }
        catch (e) {
            next(new virhekasittelija_1.Virhe());
        }
    }
    else {
        next(new virhekasittelija_1.Virhe(400, "Virheellinen id"));
    }
}));
exports.default = apiTehtavatRouter;
