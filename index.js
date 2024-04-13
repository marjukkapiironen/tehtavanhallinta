"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const virhekasittelija_1 = __importDefault(require("./errors/virhekasittelija"));
const apiAuth_1 = __importDefault(require("./routes/apiAuth"));
const apiJasenet_1 = __importDefault(require("./routes/apiJasenet"));
const apiTehtavat_1 = __importDefault(require("./routes/apiTehtavat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const checkToken = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, String(process.env.ACCESS_TOKEN_KEY));
        next();
    }
    catch (e) {
        res.status(401).json({});
    }
};
app.use(express_1.default.static(path_1.default.resolve(__dirname, "public")));
app.use("/api/auth", apiAuth_1.default);
app.use("/api/tehtavat", checkToken, apiTehtavat_1.default);
app.use("/api/jasenet", checkToken, apiJasenet_1.default);
app.use(virhekasittelija_1.default);
app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
});
app.listen(Number(process.env.PORT), () => {
    console.log(`Palvelin käynnistyi porttiin : ${Number(process.env.PORT)}`);
});
